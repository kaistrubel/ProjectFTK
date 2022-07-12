using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using ProjectFTK.Extensions;
using ProjectFTK.Models;
using ProjectFTK.Services;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ProjectFTK.Controllers;

public class StudentController : Controller
{
    private readonly ILogger<StudentController> _logger;
    private readonly CosmosClient _cosmosClient;
    private readonly CosmosServices _cosmosServices;

    public StudentController(ILogger<StudentController> logger, CosmosClient cosmosClient, CosmosServices cosmosServices)
    {
        _logger = logger;
        _cosmosClient = cosmosClient;
        _cosmosServices = cosmosServices;
    }

    [HttpGet]
    public async Task<Student> GetStudent()
    {
        var identity = User.Identity;
        var studentsContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassStudentsContainer);

        //var studentData = await studentsContainer.ReadItemAsync<Student>(identity.Email(), new PartitionKey(identity.Email()));
        //return studentData?.Resource ?? new Student();

        var studentData = studentsContainer.GetItemLinqQueryable<Student>(true).Where(x => x.Email == identity.Email()).ToList();
        if (studentData.Any())
        {
            return studentData.First();
        }

        return new Student();
    }

    [HttpPost]
    public async Task UpdateStudentProgress(Student student)
    {
        var studentsContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassStudentsContainer);
        //await studentsContainer.PatchItemAsync<Student>(identity.Email(), new PartitionKey(identity.Email()), new[] {PatchOperation.Replace("/progress", progress)});

        await studentsContainer.ReplaceItemAsync(student, student.Email);
    }
}

