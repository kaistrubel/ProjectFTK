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
public class LabController : Controller
{

    private readonly List<DateTime> _holidays = new List<DateTime>() {
        new DateTime(2022, 12, 11) //labor day
    };

    private readonly ILogger<LessonController> _logger;
    private readonly CosmosClient _cosmosClient;

    public LabController(ILogger<LessonController> logger, CosmosClient cosmosClient, CosmosServices cosmosServices)
    {
        _logger = logger;
        _cosmosClient = cosmosClient;
    }

    [HttpGet]
    public List<Lab> GetLabInfo(string courseSlug)
    {
        var labJson = System.IO.File.ReadAllText($"DataJson/Labs/{courseSlug}.json");
        var labs = JsonConvert.DeserializeObject<List<Lab>>(labJson);

        return labs;
    }

    [HttpPost]
    [Authorize(Roles = CustomRoles.Teacher)]
    public async Task<List<Models.User>> GetStudents(string courseSlug, [FromBody] List<string> studentEmails)
    {
        var usersContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassUsersContainer);
        List<(string, PartitionKey)> studenQueries = studentEmails
            .Where(x => x != User.Identity.Email())
            .Select(x => (x, PartitionKey.None))
            .ToList();

        var courseLessons = GetLabInfo(courseSlug);
        var courseLessonIds = courseLessons.Select(x => x.Name);
        var studentsData = await usersContainer.ReadManyItemsAsync<Models.User>(studenQueries);
        return studentsData.Resource.ToList();
    }

    [HttpPost]
    [Authorize(Roles = CustomRoles.Teacher)]
    public async Task GradeLab(string studentEmail, string labName, int idx, string state, string details, [FromBody] List<LabProg> labProgList)
    {
        var studentsContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassUsersContainer);
        var labProg = labProgList.FirstOrDefault(x => x.Name == labName);

        if (labProg != null)
        {
            labProgList.Remove(labProg);
        }

        labProg.Submissions[idx].State = state;
        labProg.Submissions[idx].Details = details;
        labProgList.Add(labProg);

        await studentsContainer.PatchItemAsync<Models.User>(studentEmail, PartitionKey.None, new[] { PatchOperation.Replace("/LabProgList", labProgList) });
    }
}