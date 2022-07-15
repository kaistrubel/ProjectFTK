using System;
using System.Collections.Generic;
using System.Linq;
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
public class LessonController : Controller
{
    private readonly ILogger<LessonController> _logger;
    private readonly CosmosClient _cosmosClient;
    private readonly CosmosServices _cosmosServices;



    public LessonController(ILogger<LessonController> logger, CosmosClient cosmosClient, CosmosServices cosmosServices)
    {
        _logger = logger;
        _cosmosClient = cosmosClient;
        _cosmosServices = cosmosServices;
    }

    /*
    {
      "Blockly" : 
        [ "Intro",
          "Entry Level Loops and Conditionals",
          "Deep Dive Conditionals",
          "Deep Dive Loops",
          "Math Equations",
          "Functions",
          "Javascript",
          "Open Lab"
        ]
    }
    */

    [HttpPost] 
    [Authorize(Roles = CustomRoles.Teacher)] //Expecting json body of format
    public async Task CreateCourseCirriculum(string courseSlug, [FromBody] List<Lesson> lessons)
    {
        var courseSupported = Constants.GetSupportedSubjects().Any(x => x.Courses.Any(y => y.CourseSlug == courseSlug));
        if (courseSupported == false)
        {
            throw new Exception($"The class slug {courseSlug} cannot be found.");
        }

        var container = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.LessonsContainer);
        foreach (var lesson in lessons)
        {
            lesson.CourseSlug = courseSlug;
            lesson.Id = Guid.NewGuid().ToString();
            await container.UpsertItemAsync(lesson);
        }
    }

    [HttpGet]
    //[ResponseCache(Duration = 86400, VaryByQueryKeys = new[] { "courseSlug" })]
    public async Task<List<Lesson>> GetLessons(string courseSlug)
    {
        //scale by creating a databse per subject, or district or state? or something like that
        var container = _cosmosClient.GetContainer(Constants.GlobalDb, Constants.LessonsContainer);
        var lessonData = await _cosmosServices.GetCosmosItem<Lesson>(container, x => x.CourseSlug == courseSlug);

        return lessonData;
    }
}
