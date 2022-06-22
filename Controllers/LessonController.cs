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
[Authorize(Roles = CustomRoles.Admin)]
public class LessonController : Controller
{
    private readonly ILogger<LessonController> _logger;
    private readonly CosmosClient _cosmosClient;
    private readonly CosmosServices _cosmosServices;

    private const string LessonsDatabase = "Lessons";
    private const string LecturesDatabase = "Lectures";

    public LessonController(ILogger<LessonController> logger, CosmosClient cosmosClient, CosmosServices cosmosServices)
    {
        _logger = logger;
        _cosmosClient = cosmosClient;
        _cosmosServices = cosmosServices;
    }

    //might need to rework based on how we get json body, but should be able to deseralize and then same

    //pick subject, pick course, upload json of format 
    [HttpGet]
    public async Task CreateCourseCirriculum(string courseSlug, string json)
    {
        var subject = SubjectServices.GetSupportedSubjects().FirstOrDefault(x => x.Classes.Any(y => y.CourseSlug == courseSlug));

        if (subject == null)
        {
            throw new Exception($"The class slug {courseSlug} cannot be found.");
        }

        //scale by creating a databse per subject
        var databaseResp = await _cosmosClient.CreateDatabaseIfNotExistsAsync(LessonsDatabase);
        var containerResp = await databaseResp.Database.CreateContainerIfNotExistsAsync(new ContainerProperties(subject.SubjectSlug, "/courseSlug"));

        var container = _cosmosClient.GetContainer(LessonsDatabase, subject.SubjectSlug);

        var units = JsonConvert.DeserializeObject<LessonsJson>(json)?.Units;

        if (units == null)
        {
            throw new Exception("Json File is not formatted correctly");
        }

        foreach (var unit in units)
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
        var container = _cosmosClient.GetContainer(LessonsDatabase, subjectSlug);
        var lessonData = await _cosmosServices.GetCosmosItem<Lesson>(container, x => x.CourseSlug == courseSlug);

        return lessonData.ToDictionary(x => x.Unit, x => x);
    }

    [HttpGet]
    public async Task UploadLectures(string subjectSlug, Lesson lesson, int level, bool insertLevelAsNew, string json)
    {
        //scale by creating a databse per course
        var databaseResp = await _cosmosClient.CreateDatabaseIfNotExistsAsync(LecturesDatabase);
        var containerResp = await databaseResp.Database.CreateContainerIfNotExistsAsync(new ContainerProperties(lesson.CourseSlug, "/level"));

        var lecturesContainer = _cosmosClient.GetContainer(LecturesDatabase, lesson.CourseSlug);
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

        var newLectures = JsonConvert.DeserializeObject<Lecture>(json);

        if (lecture == null)
        {
            lecture = newLectures;
            lecture.Id = lectureId;
            lecture.Level = level;
        }
        else
        {
            lecture.Notes.AddRange(newLectures.Notes);
            lecture.Videos.AddRange(newLectures.Videos);
            lecture.Problems.AddRange(newLectures.Problems);
        }

        await lecturesContainer.UpsertItemAsync(lecture, new PartitionKey(level));

        if (updateLectureInDb)
        {
            var lessonContainer = _cosmosClient.GetContainer(LessonsDatabase, subjectSlug);
            await lessonContainer.ReplaceItemAsync(lesson, lesson.LessonSlug);
        }
    }
}
