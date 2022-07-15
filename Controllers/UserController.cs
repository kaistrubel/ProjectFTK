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
    public IActionResult Info()
    {
        var identity = User.Identity;
        var userDate = new JsonResult(new
        {
            identity.Name,
            Email = identity.Email(),
            PictureUrl = identity.PictureUrl(),
            Roles = identity.Roles(),
            identity.IsAuthenticated,
            isTeacher = identity.IsInRole(CustomRoles.Teacher)
        });

        return userDate;
    }

    [HttpGet]
    public async Task<Person> GetUser()
    {
        var identity = User.Identity;
        var usersContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassUsersContainer);

        //var studentData = await studentsContainer.ReadItemAsync<Student>(identity.Email(), new PartitionKey(identity.Email()));
        //return studentData?.Resource ?? new Student();
        try
        {
            var userData = await usersContainer.ReadItemAsync<Person>(identity.Email(), PartitionKey.None);
            return userData.Resource;
        }
        catch
        {
            return new Person();
        }
    }

    [HttpPost]
    public async Task UpdateUserProgress([FromBody] UpdateResponse data)
    {
        if (data == null)
        {
            return;
        }
        var user = data.User;
        var studentsContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassUsersContainer);
        var oldProgress = data.User.Progress.FirstOrDefault(x => x.LessonId == data.UpdatedProgress.LessonId);
        if (oldProgress != null)
        {
            user.Progress.Remove(oldProgress);
        }

        user.Progress.Add(data.UpdatedProgress);

        //await studentsContainer.PatchItemAsync<User>(identity.Email(), PartitionKey.None, new[] {PatchOperation.Replace("/Progress", progress)});

        await studentsContainer.ReplaceItemAsync(user, user.Email);
    }
}

