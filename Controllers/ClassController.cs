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
        List<Subject> validatedTeachers = JsonConvert.DeserializeObject<List<Subject>>(subjectsJson);

        return validatedTeachers;
    }

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

        //check if classslug exists here

        //check if teacher already has this class for this period, and report error if they do

        //check value (below) char lengths in front end

        //Remove comments to delete and recreate table
        await _mySQLDbServices.DeleteAndCreateTable("classes", "id varchar(36), slug varchar(50), period varchar(20), teacheremail varchar(256), code varchar(8)");

        await _mySQLDbServices.InsertValues("classes", $"uuid(), '{classSlug}', '{period}', '{identity.Email()}', '{CreateRandomCode()}'");

    }

    public async Task<List<Class>> JoinClass(string email, string code) //. Max 50 students.Links email to db
    {

        //remove!!
        email = "philipedat@gmail.com";
        code = "NCNS4RI3";


        var classData = await _mySQLDbServices.GetData<List<Class>>("classes", $"teacheremail = '{email}' ");

        return classData;
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