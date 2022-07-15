using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProjectFTK.Extensions;
using Microsoft.AspNetCore.Mvc;
using ProjectFTK.Models;
using Microsoft.Azure.Cosmos;
using ProjectFTK.Services;

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
    public IActionResult CurrentUser()
    {
        var identity = User.Identity;
        var userDate = new JsonResult(new
        {
            identity.Name,
            Email = identity.Email(),
            PictureUrl = identity.PictureUrl(),
            identity.IsAuthenticated,
            isTeacher = identity.IsInRole(CustomRoles.Teacher)
        });

        return userDate;
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

        if (data == null)
        {
            return;
        }
        var user = data.User;
        var studentsContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassUsersContainer);
        var oldProgress = data.User.ProgressList.FirstOrDefault(x => x.LessonId == data.UpdatedProgress.LessonId);
        if (oldProgress != null)
        {
            user.ProgressList.Remove(oldProgress);
        }

        user.ProgressList.Add(data.UpdatedProgress);

        //await studentsContainer.PatchItemAsync<User>(identity.Email(), PartitionKey.None, new[] {PatchOperation.Replace("/Progress", progress)});

        await studentsContainer.ReplaceItemAsync(user, user.Email);
    }
}

