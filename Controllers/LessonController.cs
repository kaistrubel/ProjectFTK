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
}
