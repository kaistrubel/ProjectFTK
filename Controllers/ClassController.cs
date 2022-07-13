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

    public IActionResult Index()
    {
        return View();
    }

    [HttpPost]
    [Authorize(Roles = CustomRoles.Teacher)]
    public async Task CreateClass(string courseSlug, string period)
    {
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

        var classContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassStudentsContainer);
        var classData = await _cosmosServices.GetCosmosItem<Class>(classContainer, x => x.TeacherEmail == identity.Email() && x.Period == period);
        if (classData.Any())
        {
            throw new Exception("This class already exists for this time period.");
        }

        await classContainer.CreateItemAsync(
            new Class
            {
                Id = Guid.NewGuid(),
                CourseSlug = courseSlug,
                Period = period,
                TeacherEmail = identity.Email(),
                Code = CreateRandomCode(),
                Students = new List<string>()
            });
    }

    [HttpPost]
    [Authorize(Roles = CustomRoles.Teacher)]
    public async Task DeleteClass(Guid classId, string period)
    {
        var classContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassStudentsContainer);
        var classData = await _cosmosServices.GetCosmosItem<Class>(classContainer, x => x.Id == classId);

        await classContainer.DeleteItemAsync<Class>(classId.ToString(), new PartitionKey(period));

        var studentsContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassStudentsContainer);
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
    public async Task<string> GetCodeForClass(Guid classId)
    {
        var container = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassStudentsContainer);
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

        var classesContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassStudentsContainer);
        var classData = await _cosmosServices.GetCosmosItem<Class>(classesContainer, x => x.Id == classId);
        var classMatch = classData.SingleOrDefault() ?? throw new Exception("No Class Found with this teacher Email and Code");

        var studentsContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassStudentsContainer);
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

    [HttpPost]
    public async Task JoinClass(string teacherEmail, string code) //. Max 50 students.Links email to db
    {
        var identity = User.Identity;

        teacherEmail = teacherEmail.Trim();
        code = code.Trim();

        var classesContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassStudentsContainer);
        var classData = await _cosmosServices.GetCosmosItem<Class>(classesContainer, x => x.TeacherEmail == teacherEmail && x.Code == code);
        var classMatch = classData.SingleOrDefault() ?? throw new Exception("No Class Found with this teacher email and code combination");

        if (classMatch.StudentCount() >= maxStudentsInAClass)
        {
            throw new Exception($"This class already contains the maximum {maxStudentsInAClass} number of students");
        }

        var studentsContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassStudentsContainer);
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
    public List<Class> GetCurrentClasses()
    {
        var identity = User.Identity;
        var currentClasses = new List<Class>();
        var supportedCourses = Constants.GetSupportedSubjects().SelectMany(x => x.Courses);
        List<Class> classData = new List<Class>();

        var classesContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassStudentsContainer);
        if (identity.IsInRole(CustomRoles.Teacher))
        {
            classData = classesContainer.GetItemLinqQueryable<Class>(true).Where(x => x.TeacherEmail == identity.Email()).ToList();
        }
        else
        {
            var studentsContainer = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.ClassStudentsContainer);
            var studentData = studentsContainer.GetItemLinqQueryable<Student>(true).Where(x => x.Email == identity.Email()).ToList();
            if (studentData.Any())
            {
                var studentClassIds = studentData.First().ClassIds;
                classData = classesContainer.GetItemLinqQueryable<Class>(true).Where(x => studentClassIds.Contains(x.Id)).ToList();
            }
        }

        foreach (var classInfo in classData)
        {
            classInfo.Code = null;
            classInfo.DisplayName = $"(P: {classInfo.Period}) " + supportedCourses.Where(y => y.CourseSlug == classInfo.CourseSlug).Single().DisplayName;
            currentClasses.Add(classInfo);
        }

        return currentClasses;
    }

    public List<Subject> GetSupportedSubjects()
    {
        return Constants.GetSupportedSubjects();
    }

    /*
    [HttpGet]
    [Authorize(Roles = CustomRoles.Teacher)]
    public async Task InitializeDatabase()
    {
        //scale by creating a databse per school, or district or state? or something like that
        var classDbResp = await _cosmosClient.CreateDatabaseIfNotExistsAsync(Constants.GlobalDb);
        await classDbResp.Database.CreateContainerIfNotExistsAsync(new ContainerProperties(Constants.ClassesContainerName, "/period"), ThroughputProperties.CreateManualThroughput(400));

        //Remove commented line below to create studens container
        var studentDbResp = await _cosmosClient.CreateDatabaseIfNotExistsAsync(Constants.GlobalDb);
        await studentDbResp.Database.CreateContainerIfNotExistsAsync(new ContainerProperties(Constants.ClassesContainerName, "/email"), ThroughputProperties.CreateManualThroughput(400)); //NEED TO GET A BETTER PARTITION KEY FOR STUDENT

        //scale by creating a databse per subject
        var lessonsDbResp = await _cosmosClient.CreateDatabaseIfNotExistsAsync(Constants.LessonsDbName);

        var lectureDbResp = await _cosmosClient.CreateDatabaseIfNotExistsAsync(Constants.LecturesDbName);

        foreach (var subject in Constants.GetSupportedSubjects())
        {
            await lessonsDbResp.Database.CreateContainerIfNotExistsAsync(new ContainerProperties(subject.SubjectSlug, "/courseSlug"), ThroughputProperties.CreateManualThroughput(400));

            foreach (var clas in subject.Courses)
            {
                await lectureDbResp.Database.CreateContainerIfNotExistsAsync(new ContainerProperties(clas.CourseSlug, "/level"), ThroughputProperties.CreateManualThroughput(400));
            }
        }
    }
    */

    [HttpGet]
    [Authorize(Roles = CustomRoles.Teacher)]
    public async Task InitializeDatabase()
    {
        //scale by creating a databse per school, or district or state? or something like that
        var classDbResp = await _cosmosClient.CreateDatabaseIfNotExistsAsync(Constants.GlobalDb);
        await classDbResp.Database.CreateContainerIfNotExistsAsync(new ContainerProperties(Constants.ClassStudentsContainer, "/period"), ThroughputProperties.CreateManualThroughput(400));
        await classDbResp.Database.CreateContainerIfNotExistsAsync(new ContainerProperties(Constants.LessonsContainer, "/unit"), ThroughputProperties.CreateManualThroughput(600));
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