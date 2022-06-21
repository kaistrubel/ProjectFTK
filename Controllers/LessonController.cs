using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectFTK.Extensions;
using ProjectFTK.Models;
using ProjectFTK.Services;

namespace ProjectFTK.Controllers;

//Puts Cirriculum into Blob
[Authorize(Roles = CustomRoles.Admin)]
public class LessonController : Controller
{
    private readonly ILogger<LessonController> _logger;

    public LessonController(ILogger<LessonController> logger, BlobServiceClient blobServiceClient)
    {
        _logger = logger;
    }

    [HttpGet]
    public async Task UploadLessons(string slug, string json)
    {
        if (SubjectServices.GetSupportedSubjects().Select(x => x.Slug).Contains(slug) == false)
        {
            throw new Exception($"The class slug {slug} cannot be found.");
        }
    }
}
