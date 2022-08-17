using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Security.Policy;
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

    private readonly List<DateTime> _holidays = new List<DateTime>() {
        new DateTime(2022, 12, 11) //labor day
    };

    private readonly ILogger<LessonController> _logger;
    private readonly CosmosClient _cosmosClient;

    public LessonController(ILogger<LessonController> logger, CosmosClient cosmosClient, CosmosServices cosmosServices)
    {
        _logger = logger;
        _cosmosClient = cosmosClient;
    }

    [HttpPost]
    [Authorize(Roles = CustomRoles.Teacher)]
    public async Task AddProblem(string lessonId, string url, int level)
    {
        var lesson = await GetLesson(lessonId);
        if (lesson.Problems.Select(x => x.Url).Contains(url))
        {
            throw new Exception($"This Problem has already been added");
        }

        var container = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.LessonsContainer);
        var problem = new Problem()
        {
            Author = User.Identity.Email(),
            Url = url,
            Level = level,
            Gain = 1.0f,
            Attempts = 0
        };

        await container.PatchItemAsync<Lesson>(lessonId, PartitionKey.None, new[] { PatchOperation.Add("/Problems/-", problem) });
    }

    [HttpPost]
    [Authorize(Roles = CustomRoles.Teacher)]
    public async Task RemoveProblem(string lessonId, string url)
    {

        var container = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.LessonsContainer);
        var lesson = await GetLesson(lessonId);

        await container.PatchItemAsync<Lesson>(lessonId, PartitionKey.None, new[] { PatchOperation.Replace("/Problems", lesson.Problems.Where(x => (x.Url == url && x.Author == User.Identity.Email()) == false)) });
    }

    [HttpPost]
    [Authorize(Roles = CustomRoles.Teacher)]
    public async Task AddVideo(string lessonId, string url, int level)
    {

        if (url.Contains("youtube", StringComparison.OrdinalIgnoreCase) == false)
        {
            throw new Exception($"Only YouTube videos allowed. Error by {User.Identity.Email()}");
        }

        if (url.Contains("watch"))
        {
            url = url.Replace("/watch?v=", "/embed/");
        }

        var lesson = await GetLesson(lessonId);
        if (lesson.Videos.Select(x=>x.Url).Contains(url))
        {
            throw new Exception($"This Video has already been added");
        }

        var container = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.LessonsContainer);
        var video = new Lecture()
        {
            Author = User.Identity.Email(),
            Url = url,
            Level = level,
            Gain = 1.0f,
            Views = 0
        };

        await container.PatchItemAsync<Lesson>(lessonId, PartitionKey.None, new[] { PatchOperation.Add("/Videos/-", video) });
    }

    [HttpPost]
    public async Task UpdateVideoData(string lessonId, string url, bool isCorrect)
    {
        var lesson = await GetLesson(lessonId);
        var video = lesson.Videos.Where(x => x.Url == url).Single();
        video.Gain = ((video.Gain * video.Views) + (isCorrect ? 1: 0)) / (video.Views + 1);
        video.Views += 1;

        var container = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.LessonsContainer);
        await container.PatchItemAsync<Lesson>(lessonId, PartitionKey.None, new[] { PatchOperation.Replace("/Videos", lesson.Videos) });
    }

    [HttpPost]
    [Authorize(Roles = CustomRoles.Teacher)]
    public async Task RemoveVideo(string lessonId, string url)
    {

        var container = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.LessonsContainer);
        var lesson = await GetLesson(lessonId);

        await container.PatchItemAsync<Lesson>(lessonId, PartitionKey.None, new[] { PatchOperation.Replace("/Videos", lesson.Videos.Where(x => (x.Url == url && x.Author == User.Identity.Email()) == false)) });
    }

    [HttpPost]
    [Authorize(Roles = CustomRoles.Teacher)]
    public async Task AddNotes(string lessonId, string url, int level)
    {
        var lesson = await GetLesson(lessonId);
        if (lesson.Notes.Select(x => x.Url).Contains(url))
        {
            throw new Exception($"This Note has already been added");
        }

        var container = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.LessonsContainer);
        var notes = new Lecture()
        {
            Author = User.Identity.Email(),
            Url = url,
            Level = level,
            Gain = 1.0f,
            Views = 0
        };

        await container.PatchItemAsync<Lesson>(lessonId, PartitionKey.None, new[] { PatchOperation.Add("/Notes/-", notes) });
    }

    [HttpPost]
    public async Task UpdateNotesData(string lessonId, string url, bool isCorrect)
    {
        var lesson = await GetLesson(lessonId);
        var notes = lesson.Notes.Where(x => x.Url == url).Single();
        notes.Gain = ((notes.Gain * notes.Views) + (isCorrect ? 1 : 0)) / (notes.Views + 1);
        notes.Views += 1;

        var container = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.LessonsContainer);
        await container.PatchItemAsync<Lesson>(lessonId, PartitionKey.None, new[] { PatchOperation.Replace("/Notes", lesson.Notes) });
    }

    [HttpPost]
    [Authorize(Roles = CustomRoles.Teacher)]
    public async Task RemoveNotes(string lessonId, string url)
    {

        var container = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.LessonsContainer);
        var lesson = await GetLesson(lessonId);

        await container.PatchItemAsync<Lesson>(lessonId, PartitionKey.None, new[] { PatchOperation.Replace("/Notes", lesson.Notes.Where(x => (x.Url == url && x.Author == User.Identity.Email()) == false)) });
    }

    [HttpGet]
    [Authorize(Roles = CustomRoles.Teacher)]
    public async Task CreateEmptyLessonFromCourse(string courseSlug)
    {

        var lessonsJson = System.IO.File.ReadAllText($"DataJson/Courses/{courseSlug}.json");
        var lessons = JsonConvert.DeserializeObject<List<LessonInfo>>(lessonsJson);

        var container = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.LessonsContainer);
        foreach (var lesson in lessons)
        {
            await container.CreateItemAsync(new Lesson()
            {
                LessonId = lesson.LessonId,
                Problems = new List<Problem>(),
                Videos = new List<Lecture>(),
                Notes = new List<Lecture>()
            });
        }
    }

    [HttpGet]
    public async Task<Lesson> GetLesson(string lessonId)
    {
        var container = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.LessonsContainer);
        var lessonResp = await container.ReadItemAsync<Lesson>(lessonId, PartitionKey.None);
        //take 10 items from each lecture/problem for each level?
        var lesson = lessonResp.Resource;
        lesson.Problems = lesson.Problems.OrderByDescending(x => x.Gain).ThenByDescending(x=>x.Attempts).ToList();
        lesson.Videos = lesson.Videos.OrderByDescending(x => x.Gain).ThenByDescending(x => x.Views).ToList();
        lesson.Notes = lesson.Notes.OrderByDescending(x => x.Gain).ThenByDescending(x => x.Views).ToList();

        return lesson;
    }

    [HttpGet]
    public List<LessonInfo> GetLessonsInfo(string courseSlug)
    {
        var lessonsJson = System.IO.File.ReadAllText($"DataJson/Courses/{courseSlug}.json");
        var lessons = JsonConvert.DeserializeObject<List<LessonInfo>>(lessonsJson);

        return lessons;
    }

    [HttpPost]
    [Authorize(Roles = CustomRoles.Teacher)]
    [ResponseCache(Duration = 60)]
    public async Task<List<StudentAnalysis>> GetAnalysis(string courseSlug, [FromBody] List<string> studentEmails)
    {
        var studentData = new ConcurrentBag<StudentAnalysis>();
        var usersContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassUsersContainer);
        List<(string, PartitionKey)> studenQueries = studentEmails
            .Where(x => x != User.Identity.Email())
            .Select(x => (x, PartitionKey.None))
            .ToList();
        List<Models.User> students;

        var courseLessons = GetLessonsInfo(courseSlug);
        var courseLessonIds = courseLessons.Select(x => x.LessonId);

        var labJson = System.IO.File.ReadAllText($"DataJson/Labs/{courseSlug}.json");
        var courseLabs = JsonConvert.DeserializeObject<List<Lab>>(labJson);
        var courseLabNames = courseLabs.Select(x=>x.Name);

        var studentsData = await usersContainer.ReadManyItemsAsync<Models.User>(studenQueries);
        students = studentsData.Resource.ToList();

        Parallel.ForEach(students, student =>
        {
            /*
            var courseProg = student.ProgressList
            .Where(x => courseLessonIds.Contains(x.LessonId))
            .OrderBy(x => courseLessons.First(y => y.LessonId == x.LessonId).Order)
            .ToList();
            */

            if (student.ProgressList == null || student.ProgressList.Count == 0)
            {
                studentData.Add(new StudentAnalysis
                {
                    Name = student.Name,
                    PhotoUrl = student.PhotoUrl,
                    Time = TimeSpan.Zero.ToString(@"hh\:mm\:ss"), //account for greater than one day, maybe 4 days
                    Lesson = "L0: Has Not Started", //might want to format this Unit1 Lesson2 etc.
                    Lab = "L0: Has Not Started", //might want to format this Unit1 Lesson2 etc.
                    Status = "Behind"
                });

                return;
            }

            var courseProg = courseLessons
                            .Where(y => student.ProgressList
                            .Select(x => x.LessonId)
                            .Contains(y.LessonId))
                            .OrderBy(x => x.Order);
            var currLesson = courseProg?.LastOrDefault() ?? new LessonInfo() { Order = 0, Name = "Has Not Starated" };

            var labProg = courseLabs
                .Where(y => student.LabProgList
                .Select(x => x.Name)
                .Contains(y.Name))
                .OrderBy(x => x.Order);

            var currLab = labProg?.LastOrDefault() ?? new Lab() { Order = 0, Name = "Has Not Starated" };

            var time = TimeSpan.FromSeconds(student.ProgressList.Where(x => courseLessonIds.Contains(x.LessonId)).Sum(x => x.ActiveSeconds));
            studentData.Add(new StudentAnalysis
            {
                Name = student.Name,
                Email = student.Email,
                PhotoUrl = student.PhotoUrl,
                Time = time.ToString(@"hh\:mm\:ss"), //account for greater than one day, maybe 4 days
                Lesson = "L" + currLesson?.Order + ": " + currLesson?.Name, //might want to format this Unit1 Lesson2 etc.,
                Lab = "L" + currLab?.Order + ": " + currLab?.Name, //might want to format this Unit1 Lesson2 etc.,
                Order = currLesson?.Order ?? 0 + currLab?.Order ?? 0,
            });
        });

        var expectedCurrent = studentData.ToList().OrderBy(x => x.Order).ToArray()[(int)Math.Floor(studentData.Count * 0.8f)].Order;

        Parallel.ForEach(studentData, student =>
        {
            student.Status = student.Order >= expectedCurrent ? "OnTrack" : student.Order + 2 >= expectedCurrent ? "Warning" : "Behind";
        });

        return studentData.OrderBy(x => x.Lesson).ThenBy(x=>x.Lab).ThenBy(x => x.Status == "Warning").ThenBy(x => x.Status == "Behind").ToList();
    }

    private int SchoolDaysDifference(DateTime startDate, DateTime endDate, List<DateTime> holidays)
    {
        if (startDate > endDate)
        {
            return 0;
        }

        int cnt = 0;
        for (var current = startDate; current < endDate; current = current.AddDays(1))
        {
            if (current.DayOfWeek != DayOfWeek.Saturday
                || current.DayOfWeek != DayOfWeek.Sunday
                || (holidays != null && holidays.Contains(current.Date) == false))
            {
                cnt++;
            }
        }
        return cnt;
    }
}