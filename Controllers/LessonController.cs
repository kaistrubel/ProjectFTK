using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Newtonsoft.Json;
using ProjectFTK.Extensions;
using ProjectFTK.Models;
using ProjectFTK.Services;

namespace ProjectFTK.Controllers;

//Puts Cirriculum into Blob
//[Authorize(Roles = CustomRoles.Teacher)]
public class LessonController : Controller
{
    private readonly ILogger<LessonController> _logger;
    private readonly CosmosClient _cosmosClient;
    private readonly CosmosServices _cosmosServices;



    public LessonController(ILogger<LessonController> logger, CosmosClient cosmosClient, CosmosServices cosmosServices)
    {
        _logger = logger;
        _cosmosClient = cosmosClient;
        _cosmosServices = cosmosServices;
    }

    [HttpPost] 
    [Authorize(Roles = CustomRoles.Teacher)] //Expecting json body of format
    public async Task CreateCourseCirriculum(string courseSlug, [FromBody] Dictionary<string, List<string>> unitsToLessonsJson)
    {
        var subject = Constants.GetSupportedSubjects().FirstOrDefault(x => x.Courses.Any(y => y.CourseSlug == courseSlug));

        if (subject == null)
        {
            throw new Exception($"The class slug {courseSlug} cannot be found.");
        }

        var container = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.LessonsContainer);

        if (unitsToLessonsJson == null)
        {
            throw new Exception("Json File is not formatted correctly");
        }

        foreach (var unit in unitsToLessonsJson)
        {
            foreach (var lesson in unit.Value)
            {
                await container.CreateItemAsync(new Lesson()
                {
                    Name = lesson,
                    Unit = unit.Key,
                    CourseSlug = courseSlug
                });
            }
        }
    }

    [HttpGet]
    public async Task<Dictionary<string, List<Lesson>>> GetCirriculumn(string courseSlug)
    {
        //scale by creating a databse per subject, or district or state? or something like that
        var container = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.LessonsContainer);
        var lessonData = await _cosmosServices.GetCosmosItem<Lesson>(container, x => x.CourseSlug == courseSlug);

        return lessonData.GroupBy(x=>x.Unit).ToDictionary(x => x.Key, x => x.ToList());
    }

    [HttpPost]
    public async Task AddProblems(string courseSlug, string unit, string lesson, int level, [FromBody] Lecture lecture)
    {
        var blocklyUnitName = "Blockly";
        //scale by creating a databse per subject, or district or state? or something like that
        var container = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.LessonsContainer);
        var lessonData = await _cosmosServices.GetCosmosItem<Lesson>(container, x => x.CourseSlug == courseSlug && x.Unit == blocklyUnitName && x.LessonSlug == lesson);
        var lessonItem = lessonData.SingleOrDefault();

        if (lessonItem == null)
        {
            throw new Exception($"The lesson {lesson} does not exist in {unit} for the {courseSlug} cirriculumn");
        }

        if (lessonItem.Lectures == null)
        {
            lessonItem.Lectures = new Dictionary<int, Lecture>() { { 1, lecture } };
        }
        else if (lessonItem.Lectures.ContainsKey(level) == false)
        {
            lessonItem.Lectures.Add(level, lecture) ;
        }
        else
        {
            lessonItem.Lectures[level].Videos.AddRange(lecture.Videos);
            lessonItem.Lectures[level].Problems.AddRange(lecture.Problems);
        }

        await container.ReplaceItemAsync(lessonItem, lessonItem.LessonSlug);

        //Add notes by createing a blob items in folder courseslug/unit_lesson_level/*.pdf
    }

    /*
    [HttpPost] //split these into three uploads. Problems, Notes, Videos
    public async Task UploadLectures(string subjectSlug, Lesson lesson, int level, bool insertLevelAsNew, [FromBody] Lecture newLecturesJson)
    {
        var lecturesContainer = _cosmosClient.GetContainer(Constants.LecturesDbName, lesson.CourseSlug);
        var updateLectureInDb = false;

        if (level > 10)
        {
            throw new Exception("Level cannot exceed 10 at the momemt");
        }

        if (lesson.Lectures == null)
        {
            lesson.Lectures = new Dictionary<int, Guid>() { { 0, Guid.NewGuid() }, {1, Guid.NewGuid() } };
            updateLectureInDb = true;
        }
        else if (insertLevelAsNew)
        {
            var newMaxIndex = lesson.Lectures.Keys.Max();

            lesson.Lectures.Add(newMaxIndex, lesson.Lectures[newMaxIndex - 1]);
            for (int i = newMaxIndex - 1 ; i > level; i--)
            {
                lesson.Lectures[i] = lesson.Lectures[i - 1];
            }
            lesson.Lectures[level] = Guid.NewGuid();

            updateLectureInDb = true;
        }

        var lectureId = lesson.Lectures.First(x => x.Key == level).Value;
        var lectureData = await _cosmosServices.GetCosmosItem<Lecture>(lecturesContainer, x => x.Id == lectureId);
        var lecture = lectureData.SingleOrDefault();

        if (lecture == null)
        {
            lecture = newLecturesJson;
            lecture.Id = lectureId;
            lecture.Level = level;
        }
        else
        {
            lecture.Notes.AddRange(newLecturesJson.Notes);
            lecture.Videos.AddRange(newLecturesJson.Videos);
            lecture.Problems.AddRange(newLecturesJson.Problems);
        }

        await lecturesContainer.UpsertItemAsync(lecture, new PartitionKey(level));

        if (updateLectureInDb)
        {
            var lessonContainer = _cosmosClient.GetContainer(Constants.LessonsDbName, subjectSlug);
            await lessonContainer.ReplaceItemAsync(lesson, lesson.LessonSlug);
        }
    }
    */
}
