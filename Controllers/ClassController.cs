using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;
using Newtonsoft.Json;
using ProjectFTK.Extensions;
using ProjectFTK.Models;

namespace ProjectFTK.Controllers;

public class ClassController : Controller
{
    private const int maxStudentsInAClass = 50;
    private const string PPHS = "PPHS";
    private const string classesContainerName = "classes";
    private const string studentsContainerName = "students";

    private readonly CosmosClient _cosmosClient;

    public ClassController(CosmosClient cosmosClient)
    {
        _cosmosClient = cosmosClient;
    }

    // GET: /<controller>/
    public IActionResult Index()
    {
        return View();
    }

    public List<Subject> GetSupportedClasses()
    {
        var subjectsJson = System.IO.File.ReadAllText("DataJson/subjects.json");
        List<Subject> subjects = JsonConvert.DeserializeObject<List<Subject>>(subjectsJson);

        return subjects;
    }



    //Should be using FeedIterate to Query cosmos async. Make this into a helper function
    /// using (FeedIterator<Book> setIterator = container.GetItemLinqQueryable<Book>()
    ///                      .Where(b => b.Title == "War and Peace")
    ///                      .ToFeedIterator())
    /// {                   
    ///     //Asynchronous query execution
    ///     while (setIterator.HasMoreResults)
    ///     {
    ///         foreach(var item in await setIterator.ReadNextAsync())
    ///         {
    ///             Console.WriteLine(item.Price); 
    ///         }
    ///     }
    /// }



    [HttpGet]
    [Authorize(Roles = CustomRoles.Teacher)]
    public async Task CreateClass(string classSlug, string period) //-> adds class object to db.Checks if guid exists
    {
        var identity = User.Identity;

        //remove!!!
        classSlug = "algebra-2";
        period = "2";

        //check value (below) char lengths in front end

        if (string.IsNullOrEmpty(identity?.Email()))
        {
            throw new Exception("Teacher's email cannot be null when creating a class");
        }

        if (GetSupportedClasses().Any(x => x.Classes.Any(y => y.Slug == classSlug)) == false)
        {
            throw new Exception("Class not supported");
        }

        //scale by creating a databse per school, or district or state? or something like that
        //var databaseResp = await _cosmosClient.CreateDatabaseIfNotExistsAsync(PPHS);
        //var containerResp = await databaseResp.Database.CreateContainerIfNotExistsAsync(new ContainerProperties(classesContainer, "/period"));

        var container = _cosmosClient.GetContainer(PPHS, classesContainerName);
        var classData = container.GetItemLinqQueryable<Class>(true).Where(x=>x.TeacherEmail == identity.Email() && x.Period == period).ToList();

        if (classData.Any())
        {
            throw new Exception("This class already exists for this time period.");
        }

        await container.CreateItemAsync(new Class {Id = Guid.NewGuid(), Slug = classSlug, Period = period, TeacherEmail = identity.Email(), Code = CreateRandomCode(), Students = new List<string>() });
    }


    //See https://docs.microsoft.com/en-us/azure/cosmos-db/sql/modeling-data on many-to-many modeling
    public async Task JoinClass(string teacherEmail, string code) //. Max 50 students.Links email to db
    {
        //remove!!
        teacherEmail = "philipedat@gmail.com";
        code ??=  "V6O7A4PT";

        var identity = User.Identity;

        var classesContainer = _cosmosClient.GetContainer(PPHS, classesContainerName);
        var classData = classesContainer.GetItemLinqQueryable<Class>(true).Where(x => x.TeacherEmail == identity.Email() && x.Code == code).ToList();
        var matchedClass = classData.SingleOrDefault() ?? throw new Exception("No Class Found with this teacher Email and Code");

        if (matchedClass.StudentCount() >= maxStudentsInAClass)
        {
            throw new Exception($"This class already contains the maximum {maxStudentsInAClass} number of students");
        }

        //Remove commented line below to create studens container
        var databaseResp = await _cosmosClient.CreateDatabaseIfNotExistsAsync(PPHS);

        //NEED TO GET A BETTER PARTITION KEY FOR STUDENT
        var containerResp = await databaseResp.Database.CreateContainerIfNotExistsAsync(new ContainerProperties(studentsContainerName, "/email"));

        var studentsContainer = _cosmosClient.GetContainer(PPHS, studentsContainerName);
        var studentData = studentsContainer.GetItemLinqQueryable<Student>(true).Where(x => x.Email == identity.Email()).ToList();

        if (matchedClass.Students.Contains(identity.Email()) == false)
        {
            matchedClass.Students.Add(identity.Email());
            await classesContainer.ReplaceItemAsync(matchedClass, matchedClass.Id.ToString());
        }

        var matchedStudent = studentData?.FirstOrDefault();
        if (matchedStudent == null)
        {
            await studentsContainer.UpsertItemAsync(new Student() { Email = identity.Email(), ClassIds = new List<Guid>() { matchedClass.Id } });
        }
        else if (matchedStudent?.ClassIds.Contains(matchedClass.Id) == false)
        {
            matchedStudent.ClassIds.Add(matchedClass.Id);
            await studentsContainer.ReplaceItemAsync(matchedStudent, matchedStudent.Email);
        }
        else
        {
            throw new Exception("You are already registered for this class registered");
        }
    }

    public List<Class> GetCurrentClasses(string email)
    {
        //remove!!
        email = "philipedat@gmail.com";

        var identity = User.Identity;
        var currentClasses = new List<Class>();
        var supportedClasses = GetSupportedClasses().SelectMany(x => x.Classes);
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
            classInfo.DisplayName = supportedClasses.Where(y => y.Slug == classInfo.Slug).Single().DisplayName + (identity.IsInRole(CustomRoles.Teacher) ? $" (P: {classInfo.Period})" : String.Empty);
            currentClasses.Add(classInfo);
        }

        return currentClasses;
    }

    //Remove Student
    //Delte Class

    private string CreateRandomCode()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const int length = 8;

        var random = new Random();
        var randomString = new string(Enumerable.Repeat(chars, length)
                                                .Select(s => s[random.Next(s.Length)]).ToArray());
        return randomString;
    }

    private async Task<List<T>> GetCosmosItem<T>(Container container, Func<T, bool> where)
    {
        var itemList = new List<T>();
        using (FeedIterator<T> setIterator = container.GetItemLinqQueryable<T>()
                            .Where(where)
                            .AsQueryable()
                            .ToFeedIterator())
        {                   
            //Asynchronous query execution
            while (setIterator.HasMoreResults)
            {
                foreach(var item in await setIterator.ReadNextAsync())
                {
                    itemList.Add(item);
                }
            }
        }
        return container.GetItemLinqQueryable<T>(true).Where(where).ToList();
    }
}