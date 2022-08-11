using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Newtonsoft.Json;
using ProjectFTK.Extensions;
using ProjectFTK.Models;
using ProjectFTK.Services;

namespace ProjectFTK.Controllers;

//Puts Cirriculum into Blob
//[Authorize(Roles = CustomRoles.Teacher)]
public class LabController : Controller
{

    private readonly List<DateTime> _holidays = new List<DateTime>() {
        new DateTime(2022, 12, 11) //labor day
    };

    private readonly ILogger<LessonController> _logger;
    private readonly CosmosClient _cosmosClient;

    public LabController(ILogger<LessonController> logger, CosmosClient cosmosClient, CosmosServices cosmosServices)
    {
        _logger = logger;
    }

    [HttpGet]
    public List<Lab> GetLabInfo(string courseSlug)
    {
        var labJson = System.IO.File.ReadAllText($"DataJson/Labs/{courseSlug}.json");
        var labs = JsonConvert.DeserializeObject<List<Lab>>(labJson);

        return labs;
    }
}