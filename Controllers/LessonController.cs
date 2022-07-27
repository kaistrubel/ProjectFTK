using System;
using System.Collections.Concurrent;
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

    public LessonController(ILogger<LessonController> logger, CosmosClient cosmosClient, CosmosServices cosmosServices)
    {
        _logger = logger;
        _cosmosClient = cosmosClient;
    }

    [HttpPost]
    [Authorize(Roles = CustomRoles.Teacher)]
    public async Task UploadProblemsFromJson([FromBody] List<Lesson> lessons)
    {
        var container = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.LessonsContainer);
        foreach (var lesson in lessons)
        {
            lesson.Problems.ForEach(problem => problem.Gain = 1.0f);
            lesson.Problems.ForEach(problem => problem.Videos.ForEach(vid => vid.Gain = 1.0f));

            await container.UpsertItemAsync(lesson);
        }
    }

    [HttpPost] 
    [Authorize(Roles = CustomRoles.Teacher)]
    public async Task AddProblem(string lessonId, [FromBody] Problem problem)
    {

        var container = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.LessonsContainer);
        problem.Gain = 1.0f;
        problem.Videos.ForEach(vid => vid.Gain = 1.0f);

        await container.PatchItemAsync<Lesson>(lessonId, PartitionKey.None, new[] {PatchOperation.Add("/Problems/-", problem)});
    }

    [HttpGet]
    public async Task<List<Problem>> GetProblems(string lessonId)
    {
        var container = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.LessonsContainer);
        var lesson = await container.ReadItemAsync<Lesson>(lessonId, PartitionKey.None);
        return lesson.Resource.Problems;
    }

    [HttpGet]
    public List<LessonInfo> GetLessons(string courseSlug)
    {
        var lessonsJson = System.IO.File.ReadAllText($"DataJson/Courses/{courseSlug}.json");
        var lessons = JsonConvert.DeserializeObject<List<LessonInfo>>(lessonsJson);

        return lessons;
    }

    [HttpPost]
    [Authorize(Roles = CustomRoles.Teacher)]
    public async Task<List<StudentAnalysis>> GetAnalysis(string courseSlug, string startDate, [FromBody] List<string> studentEmails)
    {
        var studentData = new ConcurrentBag<StudentAnalysis>();
        var usersContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassUsersContainer);
        List<(string, PartitionKey)> studenQueries = studentEmails
            .Where(x => x != User.Identity.Email())
            .Select(x => (x, PartitionKey.None))
            .ToList();
        List<Models.User> students;

        var courseLessons = GetLessons(courseSlug);
        var courseLessonIds = courseLessons.Select(x => x.LessonId);
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

            var courseProg = courseLessons
                            .Where(y => student.ProgressList
                            .Select(x => x.LessonId)
                            .Contains(y.LessonId))
                            .OrderBy(x => x.Order);

            var current = courseProg.Last();
            var studentDays = courseProg.Sum(x => x.Days);
            var expectedDays = SchoolDaysDifference(DateTime.Parse(startDate), DateTime.Now, null);
            var status = studentDays > expectedDays ? "OnTrack" : studentDays + 3 > expectedDays ? "Warning" : "Behind"; 

            var time = TimeSpan.FromSeconds(student.ProgressList.Sum(x => x.ActiveSeconds));
            studentData.Add(new StudentAnalysis
            {
                Name = student.Name,
                PhotoUrl = student.PhotoUrl,
                Time = time.ToString(@"hh\:mm\:ss"), //account for greater than one day, maybe 4 days
                Current = "L" + current.Order + ": " + current.Name, //might want to format this Unit1 Lesson2 etc.
                Status = status
            });
        });

        return studentData.OrderBy(x=>x.Current).ThenBy(x=>x.Status == "Warning").ThenBy(x=>x.Status == "Behind").ToList();
    }

    private int SchoolDaysDifference(DateTime startDate, DateTime endDate, IEnumerable<DateTime> holidays)
    {
        if (startDate > endDate)
        {
            throw new Exception($"{startDate} cannot be greater than {endDate}.");
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
