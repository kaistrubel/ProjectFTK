using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;
using Newtonsoft.Json;
using ProjectFTK.Extensions;
using ProjectFTK.Models;
using ProjectFTK.Services;

namespace ProjectFTK.Controllers;

public class ClassController : Controller
{
    private const int maxStudentsInAClass = 50;
    private const string PPHS = "PPHS";
    private const string classesContainerName = "classes";
    private const string studentsContainerName = "students";

    private readonly CosmosClient _cosmosClient;
    private readonly CosmosServices _cosmosServices;

    public ClassController(CosmosClient cosmosClient, CosmosServices cosmosServices)
    {
        _cosmosClient = cosmosClient;
        _cosmosServices = cosmosServices;
    }

    public IActionResult Index()
    {
        return View();
    }

    [HttpGet]
    [Authorize(Roles = CustomRoles.Teacher)]
    public async Task CreateClass(string classSlug, string period) //-> adds class object to db.Checks if guid exists
    {
        var identity = User.Identity;

        //remove!!!
        classSlug = "algebra-2";
        period = "2";

        if (string.IsNullOrEmpty(identity?.Email()))
        {
            throw new Exception("Teacher's email cannot be null when creating a class");
        }

        var subjectSlug = SubjectServices.GetSupportedSubjects().FirstOrDefault(x => x.Classes.Any(y => y.CourseSlug == classSlug))?.SubjectSlug;
        if (subjectSlug == null)
        {
            throw new Exception($"The Class {classSlug} is currently not supported");
        }

        //scale by creating a databse per school, or district or state? or something like that
        //var databaseResp = await _cosmosClient.CreateDatabaseIfNotExistsAsync(PPHS);
        //var containerResp = await databaseResp.Database.CreateContainerIfNotExistsAsync(new ContainerProperties(classesContainerName, "/period"));

        var classContainer = _cosmosClient.GetContainer(PPHS, classesContainerName);
        var classData = await _cosmosServices.GetCosmosItem<Class>(classContainer, x => x.TeacherEmail == identity.Email() && x.Period == period);

        if (classData.Any())
        {
            throw new Exception("This class already exists for this time period.");
        }

        await classContainer.CreateItemAsync(new Class {
            Id = Guid.NewGuid(),
            CourseSlug = classSlug,
            SubjectSlug = subjectSlug,
            Period = period,
            TeacherEmail = identity.Email(),
            Code = CreateRandomCode(),
            Students = new List<string>()
        });
    }

    [HttpGet]
    [Authorize(Roles = CustomRoles.Teacher)]
    public async Task DeleteClass(Guid classId, string period)
    {
        var classContainer = _cosmosClient.GetContainer(PPHS, classesContainerName);
        var classData = await _cosmosServices.GetCosmosItem<Class>(classContainer, x => x.Id == classId);

        await classContainer.DeleteItemAsync<Class>(classId.ToString(), new PartitionKey(period));

        var studentsContainer = _cosmosClient.GetContainer(PPHS, studentsContainerName);
        var studentData = await _cosmosServices.GetCosmosItem<Student>(studentsContainer, x => x.ClassIds.Contains(classId));

        foreach (var student in studentData)
        {
            if (student.ClassIds.Contains(classId))
            {
                student.ClassIds.Remove(classId);
                await studentsContainer.ReplaceItemAsync(student, student.Email);
            }
        }

        if (classData.Any())
        {
            throw new Exception("This class has already been deleted.");
        }
    }

    [HttpGet]
    [Authorize(Roles = CustomRoles.Teacher)]
    public async Task<string> GetCodeForClass(Guid classId) //-> adds class object to db.Checks if guid exists
    {
        var container = _cosmosClient.GetContainer(PPHS, classesContainerName);
        var classData = await _cosmosServices.GetCosmosItem<Class>(container, x => x.Id == classId);

        if (classData.Any())
        {
            throw new Exception("This class cannot be found.");
        }

        return classData.Single().Code;
    }

    [HttpGet]
    [Authorize(Roles = CustomRoles.Teacher)]
    public async Task RemoveStudentFromClass(Guid classId, string studentEmail)
    {
        //remove!!
        studentEmail = "philipedat@gmail.com";

        var classesContainer = _cosmosClient.GetContainer(PPHS, classesContainerName);
        var classData = await _cosmosServices.GetCosmosItem<Class>(classesContainer, x => x.Id == classId);
        var classMatch = classData.SingleOrDefault() ?? throw new Exception("No Class Found with this teacher Email and Code");

        var studentsContainer = _cosmosClient.GetContainer(PPHS, studentsContainerName);
        var studentData = await _cosmosServices.GetCosmosItem<Student>(studentsContainer, x => x.Email == studentEmail);

        if (classMatch.Students.Contains(studentEmail))
        {
            classMatch.Students.Remove(studentEmail);
            await classesContainer.ReplaceItemAsync(classMatch, classMatch.Id.ToString());
        }

        var studentMatch = studentData?.FirstOrDefault();
        if (studentMatch?.ClassIds.Contains(classMatch.Id) == true)
        {
            studentMatch.ClassIds.Remove(classMatch.Id);
            await studentsContainer.ReplaceItemAsync(studentMatch, studentMatch.Email);
        }
        else
        {
            throw new Exception("You have already been removed from this class");
        }
    }

    [HttpGet]
    public async Task JoinClass(string teacherEmail, string code) //. Max 50 students.Links email to db
    {
        //remove!!
        teacherEmail = "philipedat@gmail.com";
        code ??=  "V6O7A4PT";

        var identity = User.Identity;

        var classesContainer = _cosmosClient.GetContainer(PPHS, classesContainerName);
        var classData = await _cosmosServices.GetCosmosItem<Class>(classesContainer, x => x.TeacherEmail == identity.Email());
        var classMatch = classData.SingleOrDefault() ?? throw new Exception("No Class Found with this teacher Email and Code");

        if (classMatch.StudentCount() >= maxStudentsInAClass)
        {
            throw new Exception($"This class already contains the maximum {maxStudentsInAClass} number of students");
        }

        //Remove commented line below to create studens container
        //var databaseResp = await _cosmosClient.CreateDatabaseIfNotExistsAsync(PPHS);

        //NEED TO GET A BETTER PARTITION KEY FOR STUDENT
        //var containerResp = await databaseResp.Database.CreateContainerIfNotExistsAsync(new ContainerProperties(studentsContainerName, "/email"));

        var studentsContainer = _cosmosClient.GetContainer(PPHS, studentsContainerName);
        var studentData = await _cosmosServices.GetCosmosItem<Student>(studentsContainer, x => x.Email == identity.Email());

        if (classMatch.Students.Contains(identity.Email()) == false)
        {
            classMatch.Students.Add(identity.Email());
            await classesContainer.ReplaceItemAsync(classMatch, classMatch.Id.ToString());
        }

        var studentMatch = studentData?.FirstOrDefault();
        if (studentMatch == null)
        {
            await studentsContainer.UpsertItemAsync(new Student() { Email = identity.Email(), ClassIds = new List<Guid>() { classMatch.Id } });
        }
        else if (studentMatch?.ClassIds.Contains(classMatch.Id) == false)
        {
            studentMatch.ClassIds.Add(classMatch.Id);
            await studentsContainer.ReplaceItemAsync(studentMatch, studentMatch.Email);
        }
        else
        {
            throw new Exception("You are already registered for this class registered");
        }
    }

    [HttpGet]
    public List<Class> GetCurrentClasses(string email)
    {
        //remove!!
        email = "philipedat@gmail.com";

        var identity = User.Identity;
        var currentClasses = new List<Class>();
        var supportedSubjects = SubjectServices.GetSupportedSubjects().SelectMany(x => x.Classes);
        List<Class> classData;

        var classesContainer = _cosmosClient.GetContainer(PPHS, classesContainerName);
        if (identity.IsInRole(CustomRoles.Teacher))
        {
            classData = classesContainer.GetItemLinqQueryable<Class>(true).Where(x => x.TeacherEmail == identity.Email()).ToList();
        }
        else
        {
            var studentsContainer = _cosmosClient.GetContainer(PPHS, studentsContainerName);
            var studentData = studentsContainer.GetItemLinqQueryable<Student>(true).Where(x => x.Email == identity.Email()).ToList();
            classData = classesContainer.GetItemLinqQueryable<Class>(true).Where(x => studentData.First().ClassIds.Contains(x.Id)).ToList();
        }

        foreach (var classInfo in classData)
        {
            classInfo.Code = null;
            classInfo.DisplayName = supportedSubjects.Where(y => y.CourseSlug == classInfo.CourseSlug).Single().DisplayName + (identity.IsInRole(CustomRoles.Teacher) ? $" (P: {classInfo.Period})" : String.Empty);
            currentClasses.Add(classInfo);
        }

        return currentClasses;
    }

    public List<Subject> GetSupportedSubjects()
    {
        return SubjectServices.GetSupportedSubjects();
    }

    private string CreateRandomCode()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const int length = 8;

        var random = new Random();
        var randomString = new string(Enumerable.Repeat(chars, length)
                                                .Select(s => s[random.Next(s.Length)]).ToArray());
        return randomString;
    }
}