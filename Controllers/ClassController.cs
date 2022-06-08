using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using ProjectFTK.Extensions;
using ProjectFTK.Models;
using ProjectFTK.Services;

namespace ProjectFTK.Controllers;

public class ClassController : Controller
{
    private const int maxStudentsInAClass = 50;
    private const string classesTable = "classes";
    private const string classes_studentsTable = "classes_students";

    private readonly MySqlConnection _mySqlConnection;
    private readonly MySQLDbServices _mySQLDbServices;

    public ClassController(MySqlConnection mySqlConnection, MySQLDbServices mySQLDbServices)
    {
        _mySqlConnection = mySqlConnection;
        _mySQLDbServices = mySQLDbServices;
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

        using var command = _mySqlConnection.CreateCommand();
        await command.Connection.OpenAsync();

        //scale by creating a table per school, or district or something like that
        var classData = await _mySQLDbServices.GetData<List<Class>>(command, classesTable, $"teacheremail = '{identity.Email()}' AND period = '{period}'");

        if (classData.Any())
        {
            throw new Exception("This class already exists for this time period.");
        }

        //Remove commented line below to delete and recreate table
        //await _mySQLDbServices.DeleteAndCreateTable(classesTable, "id varchar(36), slug varchar(50), period varchar(20), teacheremail varchar(256), code varchar(8)");

        await _mySQLDbServices.InsertValues(command, classesTable, $"uuid(), '{classSlug}', '{period}', '{identity.Email()}', '{CreateRandomCode()}'");
        await command.Connection.CloseAsync();
    }

    [HttpGet]
    public async Task JoinClass(string teacherEmail, string code) //. Max 50 students.Links email to db
    {
        //remove!!
        teacherEmail = "philipedat@gmail.com";
        code = "X8DLS5FA";

        //check if student already in class
        //check number of students in class

        var identity = User.Identity;

        using var command = _mySqlConnection.CreateCommand();
        await command.Connection.OpenAsync();

        var classData = await _mySQLDbServices.GetData<List<Class>>(command, classesTable, $"teacheremail = '{teacherEmail}' AND code = '{code}'");
        var classId = classData.SingleOrDefault()?.Id ?? throw new Exception("No Class Found with this teacher Email and Code");

        //Remove commented line below to delete and recreate table
        //await _mySQLDbServices.DeleteAndCreateTable(command, classes_studentsTable, "id varchar(36), email varchar(256)");

        if (await _mySQLDbServices.GetCount(command, classes_studentsTable, $"id = '{classId}'", "email") > maxStudentsInAClass)    //should we save a classid to students list?
        {
            throw new Exception($"This class already contains the maximum {maxStudentsInAClass} number of students");
        }

        var classes = await _mySQLDbServices.GetData<List<Class>>(command, classes_studentsTable, $"email = '{identity.Email()}'", "id");

        if (classes.Any(x=>x.Id == classId))
        {
            throw new Exception("You are already registered for this class registered");
        }

        await _mySQLDbServices.InsertValues(command, classes_studentsTable, $"'{classId}', '{identity.Email()}'");
        await command.Connection.CloseAsync();
    }

    [HttpGet]
    public async Task<List<Class>> GetCurrentClasses(string email)
    {
        //remove!!
        email = "philipedat@gmail.com";

        var identity = User.Identity;
        var currentClasses = new List<Class>();

        using var command = _mySqlConnection.CreateCommand();
        await command.Connection.OpenAsync();

        var classes = await _mySQLDbServices.GetData<List<Class>>(command, classes_studentsTable, $"email = '{identity.Email()}'", "id");
        var supportedClasses = GetSupportedClasses().SelectMany(x=>x.Classes);

        foreach (var id in classes.Select(x=>x.Id))
        {
            var classInfo = await _mySQLDbServices.GetData<List<Class>>(command, classesTable, $"id = '{id}'", "period, id, slug");
            classInfo.Single().DisplayName = supportedClasses.Where(y => y.Slug == classInfo.Single().Slug).Single().DisplayName + (identity.IsInRole(CustomRoles.Teacher) ? $" (P: {classInfo.Single().Period})" : String.Empty);
            currentClasses.Add(classInfo.Single());
        }

        await command.Connection.CloseAsync();
        return currentClasses;
    }

    [HttpGet]
    public async Task RemoveStudent(string teacherEmail, string code) //. Max 50 students.Links email to db
    {
        //remove!!
        teacherEmail = "philipedat@gmail.com";
        code = "X8DLS5FA";

        //check if student already in class
        //check number of students in class

        var identity = User.Identity;

        using var command = _mySqlConnection.CreateCommand();
        await command.Connection.OpenAsync();

        var classData = await _mySQLDbServices.GetData<List<Class>>(command, classesTable, $"teacheremail = '{teacherEmail}' AND code = '{code}'");
        var classId = classData.SingleOrDefault()?.Id ?? throw new Exception("No Class Found with this teacher Email and Code");

        //Remove commented line below to delete and recreate table
        //await _mySQLDbServices.DeleteAndCreateTable(command, classes_studentsTable, "id varchar(36), email varchar(256)");

        if (await _mySQLDbServices.GetCount(command, classes_studentsTable, $"id = '{classId}'", "email") > maxStudentsInAClass)    //should we save a classid to students list?
        {
            throw new Exception($"This class already contains the maximum {maxStudentsInAClass} number of students");
        }

        var classes = await _mySQLDbServices.GetData<List<Class>>(command, classes_studentsTable, $"email = '{identity.Email()}'", "id");

        if (classes.Any(x => x.Id == classId))
        {
            throw new Exception("You are already registered for this class registered");
        }

        await _mySQLDbServices.InsertValues(command, classes_studentsTable, $"'{classId}', '{identity.Email()}'");
        await command.Connection.CloseAsync();
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
}