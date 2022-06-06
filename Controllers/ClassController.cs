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
    private const string studentsTable = "students";

    private readonly MySQLDbServices _mySQLDbServices;

    public ClassController(MySQLDbServices mySQLDbServices)
    {
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

        //scale by creating a db per school, or district or something like that
        var classData = await _mySQLDbServices.GetData<List<Class>>(classesTable, $"teacheremail = '{identity.Email()}' AND period = '{period}'");

        if (classData.Any())
        {
            throw new Exception("This class already exists for this time period.");
        }

        //Remove commented line below to delete and recreate table
        //await _mySQLDbServices.DeleteAndCreateTable(classesTable, "id varchar(36), slug varchar(50), period varchar(20), teacheremail varchar(256), code varchar(8)");

        await _mySQLDbServices.InsertValues(classesTable, $"uuid(), '{classSlug}', '{period}', '{identity.Email()}', '{CreateRandomCode()}'");
    }

    public async Task<int> JoinClass(string teacherEmail, string code) //. Max 50 students.Links email to db
    {

        //remove!!
        teacherEmail = "philipedat@gmail.com";
        code = "X8DLS5FA";

        //check if student already in class
        //check number of students in class

        var identity = User.Identity;

        var classData = await _mySQLDbServices.GetData<List<Class>>(classesTable, $"teacheremail = '{teacherEmail}' AND code = '{code}'");
        var classId = classData.Single().Slug;

        //Remove commented line below to delete and recreate table
        await _mySQLDbServices.DeleteAndCreateTable("students", "email varchar(256), classids json");

        if (await _mySQLDbServices.GetCount("students", $"classids LIKE '{classId}'", "email") > maxStudentsInAClass)
        {
            throw new Exception($"This class already contains the maximum {maxStudentsInAClass} number of students");
        }

        return await _mySQLDbServices.GetCount("students", $"classids LIKE '{classId}'", "email");
    }

    //GetCurrentClasses

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