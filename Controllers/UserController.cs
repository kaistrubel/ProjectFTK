using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProjectFTK.Extensions;
using Microsoft.AspNetCore.Mvc;
using ProjectFTK.Models;
using Microsoft.Azure.Cosmos;
using ProjectFTK.Services;
using System.Runtime.InteropServices;

namespace ProjectFTK.Controllers;

public class UserController : Controller
{
    private readonly ILogger<UserController> _logger;
    private readonly CosmosClient _cosmosClient;

    public UserController(ILogger<UserController> logger, CosmosClient cosmosClient)
    {
        _logger = logger;
        _cosmosClient = cosmosClient;
    }

    [HttpGet]
    public async Task<IActionResult> CurrentUser()
    {
        Models.User user;
        var identity = User.Identity;
        var usersContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassUsersContainer);
        try
        {
            var userFromDb = await usersContainer.ReadItemAsync<Models.User>(identity.Email(), PartitionKey.None);
            user = userFromDb.Resource;
        }
        catch
        {
            user = new Models.User();
        }

        var userData = new JsonResult(new
        {
            identity.Name,
            Email = identity.Email(),
            PictureUrl = identity.PictureUrl(),
            user?.ProgressList,
            user?.LabProgList,
            identity.IsAuthenticated,
            isTeacher = identity.IsInRole(CustomRoles.Teacher)
        });

        return userData;
    }

    [HttpGet]
    public async Task<Models.User> GetUser(string email)
    {
        var usersContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassUsersContainer);
        try
        {
            var userData = await usersContainer.ReadItemAsync<Models.User>(email, PartitionKey.None);
            return userData.Resource;
        }
        catch
        {
            throw new Exception($"Cannot find user with email {email}");
        }
    }

    [HttpPost]
    public async Task UpdateUserProgress([FromBody] UpdateResponse data)
    {
        //should be able to use patch operation similar to Lesson/AddProblem
        var identity = User.Identity;

        if (data == null)
        {
            return;
        }

        var studentsContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassUsersContainer);
        var progressList = data.ProgressList ?? new List<Progress>();
        var oldProgress = progressList.FirstOrDefault(x => x.LessonId == data.UpdatedProgress.LessonId);

        if (oldProgress != null)
        {
            progressList.Remove(oldProgress);
        }
        progressList.Add(data.UpdatedProgress);

        await studentsContainer.PatchItemAsync<Models.User>(identity.Email(), PartitionKey.None, new[] {PatchOperation.Replace("/ProgressList", progressList)});
    }

    [HttpPost]
    public async Task UpdateUserLabProg([FromBody] UpdateLabProgResponse data)
    {
        if (data == null)
        {
            return;
        }

        var identity = User.Identity;

        var studentsContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassUsersContainer);
        var progressList = data.LabProgList ?? new List<LabProg>();
        var progress = progressList.FirstOrDefault(x => x.Name == data.CurrentLabName);

        if (progress != null)
        {
            progressList.Remove(progress);
        }

        if (progress == null)
        {
            progress = new LabProg() { Name = data.CurrentLabName, Submissions = new List<Submission>() { new Submission() { Url = data.SubmissionUrl, State = "NeedsGrading" } } };
        }
        else if (data.SubmissionIdx >= progress.Submissions.Count)
        {
            progress.Submissions.Add(new Submission() { Url = data.SubmissionUrl, State = "NeedsGrading" });
        }
        else
        {
            progress.Submissions[data.SubmissionIdx].Url = data.SubmissionUrl;
            progress.Submissions[data.SubmissionIdx].State = data.State;
        }

        progressList.Add(progress);

        await studentsContainer.PatchItemAsync<Models.User>(identity.Email(), PartitionKey.None, new[] { PatchOperation.Replace("/LabProgList", progressList) });
    }
}

