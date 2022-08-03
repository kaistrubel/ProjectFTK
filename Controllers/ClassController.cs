using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using ProjectFTK.Extensions;
using ProjectFTK.Models;
using ProjectFTK.Services;

namespace ProjectFTK.Controllers;

public class ClassController : Controller
{
    private const int maxStudentsInAClass = 50;

    private readonly CosmosClient _cosmosClient;
    private readonly CosmosServices _cosmosServices;

    public ClassController(CosmosClient cosmosClient, CosmosServices cosmosServices)
    {
        _cosmosClient = cosmosClient;
        _cosmosServices = cosmosServices;
    }

    [HttpPost]
    [Authorize(Roles = CustomRoles.Teacher)]
    public async Task CreateClass(string courseSlug, string period)
    {
        Models.User user = null;
        var identity = User.Identity;

        if (string.IsNullOrEmpty(identity?.Email()))
        {
            throw new Exception("Teacher's email cannot be null when creating a class");
        }

        var subjectSlug = Constants.GetSupportedSubjects().FirstOrDefault(x => x.Courses.Any(y => y.CourseSlug == courseSlug))?.SubjectSlug;
        if (subjectSlug == null)
        {
            throw new Exception($"The Class {courseSlug} is currently not supported");
        }

        var newGuid = Guid.NewGuid().ToString();
        var userContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassUsersContainer);
        try
        {
            var userData = await userContainer.ReadItemAsync<Models.User>(identity.Email(), PartitionKey.None);
            user = userData.Resource;
        }
        catch
        {
            await userContainer.CreateItemAsync(new Models.User() {
                Name = identity.Name,
                Email = identity.Email(),
                PhotoUrl = identity.PictureUrl(),
                ClassIds = new List<string>() { newGuid },
                ProgressList = new List<Progress>()
            });
        }

        var classContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassUsersContainer);
        if (user != null)
        {
            var classData = await classContainer.ReadManyItemsAsync<Class>(CosmosManyQueryKeyFromId(user.ClassIds));
            if (classData.Resource?.Any(x => x.CourseSlug == courseSlug && x.Period == period) == true)
            {
                throw new Exception("This class already exists for this time period.");
            }
            else
            {
                user.ClassIds.Add(newGuid);
                //await userContainer.PatchItemAsync<Models.User>(user.Email, new PartitionKey(user.Email), new List<PatchOperation>() { PatchOperation.Replace("ClassIds", user.ClassIds) } );
                await userContainer.ReplaceItemAsync(user, user.Email);
            }
        }

        await classContainer.CreateItemAsync(
            new Class
            {
                Id = newGuid,
                CourseSlug = courseSlug,
                Period = period,
                TeacherEmail = identity.Email(),
                Code = CreateRandomCode(),
                Users = new List<string>() { identity.Email() }
            });
    }
    [HttpPost]
    [Authorize(Roles = CustomRoles.Teacher)]
    public async Task DeleteClass(string classId)
    {
        var classContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassUsersContainer);
        await classContainer.DeleteItemAsync<Class>(classId, PartitionKey.None);

        var studentsContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassUsersContainer);
        var studentData = await _cosmosServices.GetCosmosItem<Models.User>(studentsContainer, x => x.ClassIds.Contains(classId));

        foreach (var student in studentData)
        {
            if (student.ClassIds.Contains(classId))
            {
                student.ClassIds.Remove(classId);
                await studentsContainer.ReplaceItemAsync(student, student.Email);
            }
        }
    }

    [HttpGet]
    [Authorize(Roles = CustomRoles.Teacher)]
    public async Task<string> GetCodeForClass(string courseId)
    {
        var classContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassUsersContainer);

        try
        {
            var classData = await classContainer.ReadItemAsync<Class>(courseId, PartitionKey.None);
            return classData.Resource.Code;
        }
        catch
        {
            throw new Exception("This class cannot be found.");
        }
    }

    [HttpPost]
    [Authorize(Roles = CustomRoles.Teacher)]
    public async Task RemoveStudentFromClass(string classId, string studentEmail)
    {
        Class classMatch;
        Models.User studentMatch;

        var classContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassUsersContainer);
        var userContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassUsersContainer);

        try
        {
            var classData = await classContainer.ReadItemAsync<Class>(classId, PartitionKey.None);
            classMatch = classData.Resource;

            var studentData = await userContainer.ReadItemAsync<Models.User>(studentEmail, PartitionKey.None);
            studentMatch = studentData.Resource;

        }
        catch
        {
            throw new Exception("This class or student cannot be found.");
        }


        if (classMatch.Users.Contains(studentEmail))
        {
            classMatch.Users.Remove(studentEmail);
            await classContainer.ReplaceItemAsync(classMatch, classMatch.Id.ToString());
        }

        if (studentMatch?.ClassIds.Contains(classMatch.Id) == true)
        {
            studentMatch.ClassIds.Remove(classMatch.Id);
            await userContainer.ReplaceItemAsync(studentMatch, studentMatch.Email);
        }
    }

    [HttpPost]
    public async Task JoinClass(string teacherEmail, string code) //. Max 50 students.Links email to db
    {
        Models.User student = null;
        var identity = User.Identity;

        teacherEmail = teacherEmail.Trim();
        code = code.Trim();

        var classesContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassUsersContainer);
        var classData = await _cosmosServices.GetCosmosItem<Class>(classesContainer, x => x.TeacherEmail == teacherEmail && x.Code == code);
        var classMatch = classData.SingleOrDefault() ?? throw new Exception("No Class Found with this teacher email and code combination");

        if (classMatch.UserCount() >= maxStudentsInAClass)
        {
            throw new Exception($"This class already contains the maximum {maxStudentsInAClass} number of students");
        }

        var userContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassUsersContainer);
        try
        {
            var studentData = await userContainer.ReadItemAsync<Models.User>(identity.Email(), PartitionKey.None);
            student = studentData.Resource;

        }
        catch
        {
            await userContainer.CreateItemAsync(
                new Models.User() {
                    Name = identity.Name,
                    Email = identity.Email(),
                    PhotoUrl = identity.PictureUrl(),
                    ClassIds = new List<string>() { classMatch.Id },
                    ProgressList = new List<Progress>()
                });
        }

        if (classMatch.Users.Contains(identity.Email()) == false)
        {
            classMatch.Users.Add(identity.Email());
            await classesContainer.ReplaceItemAsync(classMatch, classMatch.Id.ToString());
        }

        if (student?.ClassIds.Contains(classMatch.Id) == false)
        {
            student.ClassIds.Add(classMatch.Id);
            await userContainer.ReplaceItemAsync(student, student.Email);
        }
    }

    [HttpGet]
    public async Task<List<Class>> GetCurrentClasses()
    {
        Models.User user = null;
        var identity = User.Identity;
        var supportedCourses = Constants.GetSupportedSubjects().SelectMany(x => x.Courses);

        var userContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassUsersContainer);
        try
        {
            var userData = await userContainer.ReadItemAsync<Models.User>(identity.Email(), PartitionKey.None);
            user = userData.Resource;

        }
        catch (Exception e)
        {
            return new List<Class>() { new Class() { Id=""} };
        }

        var classContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassUsersContainer);
        var classData = await classContainer.ReadManyItemsAsync<Class>(CosmosManyQueryKeyFromId(user.ClassIds));

        foreach (var classInfo in classData)
        {
            classInfo.Code = null;
            classInfo.DisplayName = $"(P: {classInfo.Period}) " + supportedCourses.Where(y => y.CourseSlug == classInfo.CourseSlug).Single().DisplayName;
        }

        return classData.ToList();
    }

    public List<Subject> GetSupportedSubjects()
    {
        return Constants.GetSupportedSubjects();
    }

    [HttpGet]
    [Authorize(Roles = CustomRoles.Teacher)]
    public async Task InitializeDatabase()
    {
        //scale by creating a databse per school, or district or state? or something like that
        var classDbResp = await _cosmosClient.CreateDatabaseIfNotExistsAsync(Constants.GlobalDb);
        await classDbResp.Database.CreateContainerIfNotExistsAsync(new ContainerProperties(Constants.ClassUsersContainer, "/id"), ThroughputProperties.CreateManualThroughput(600));
        await classDbResp.Database.CreateContainerIfNotExistsAsync(new ContainerProperties(Constants.LessonsContainer, "/id"), ThroughputProperties.CreateManualThroughput(400));
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

    private List<(string, PartitionKey)> CosmosManyQueryKeyFromId(List<string> ids)
    {
        return ids.Select(x => (x, PartitionKey.None)).ToList();
    }
}