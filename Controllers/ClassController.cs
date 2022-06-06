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

namespace ProjectFTK.Controllers;

public class ClassController : Controller
{
    private readonly MySqlConnection _mySqlConnection;

    public ClassController(MySqlConnection mySqlConnection)
    {
        _mySqlConnection = mySqlConnection;
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

        //check if classslug exists

        using var command = _mySqlConnection.CreateCommand();
        await command.Connection.OpenAsync();

        //Remove comments to delete and recreate table
        ///*
        command.CommandText = "DROP TABLE IF EXISTS classes;";
        await command.ExecuteNonQueryAsync();

        command.CommandText = "CREATE TABLE classes (id varchar(36), class varchar(50), period varchar(20), teacher_email varchar(256), code varchar(8));"; //check char lengths in front end
        await command.ExecuteNonQueryAsync();
        //*/

        command.CommandText = $"INSERT INTO classes VALUES (uuid(), '{classSlug}', '{period}', '{identity.Email()}', '{CreateRandomCode()}')";
        await command.ExecuteNonQueryAsync();

        await command.Connection.CloseAsync();

    }

    public async Task<List<string>> JoinClass(string email, string code) //. Max 50 students.Links email to db
    {

        //remove!!
        email = "philipedat@gmail.com";
        code = "NCNS4RI3";


        List<string> retval = new List<string>();
        using var command = _mySqlConnection.CreateCommand();
        await command.Connection.OpenAsync();

        command.CommandText = $"SELECT teacher_email, code, id FROM classes WHERE teacher_email = '{email}' AND code = '{code}'";

        using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            retval.Add(reader.GetString(0));
            retval.Add(reader.GetString(1));
            retval.Add(reader.GetString(2));
        }

        await command.Connection.CloseAsync();

        return retval;
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