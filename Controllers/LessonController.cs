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

    [HttpPost] //Expecting json body of format
    public async Task CreateCourseCirriculum(string courseSlug, [FromBody] Dictionary<string, List<string>> unitsToLessonsJson)
    {
        var subject = Constants.GetSupportedSubjects().FirstOrDefault(x => x.Courses.Any(y => y.CourseSlug == courseSlug));

        if (subject == null)
        {
            throw new Exception($"The class slug {courseSlug} cannot be found.");
        }

        var container = _cosmosClient.GetContainer(Constants.LessonsDbName, subject.SubjectSlug);

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
    public async Task<Dictionary<string, Lesson>> GetCirriculumn(string subjectSlug, string courseSlug)
    {
        //scale by creating a databse per subject, or district or state? or something like that
        var container = _cosmosClient.GetContainer(Constants.LessonsDbName, subjectSlug);
        var lessonData = await _cosmosServices.GetCosmosItem<Lesson>(container, x => x.CourseSlug == courseSlug);

        return lessonData.ToDictionary(x => x.Unit, x => x);
    }

    [HttpPost] //split these into three uploads. Problems, Notes, Videos
    public async Task UploadLectures(string subjectSlug, Lesson lesson, int level, bool insertLevelAsNew, [FromBody] Lecture newLecturesJson)
    {
        var lecturesContainer = _cosmosClient.GetContainer(Constants.LecturesDbName, lesson.CourseSlug);
        var updateLectureInDb = false;

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
}
