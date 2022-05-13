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

namespace ProjectFTK.Controllers;

//Puts Cirriculum into Blob
[Authorize(Roles = CustomRoles.Teacher)]
public class CurriculumController : Controller
{
    private readonly BlobContainerClient _blobContainerClient;
    private readonly ILogger<CurriculumController> _logger;

    public CurriculumController(ILogger<CurriculumController> logger, BlobServiceClient blobServiceClient)
    {
        _logger = logger;
        _blobContainerClient = blobServiceClient.GetBlobContainerClient("Curriculum");
    }


    [HttpPost]
    public async Task Create(string name, Subject subject, IList<Node> nodes)
    {
        foreach (var node in nodes)
        {
            using MemoryStream stream = new MemoryStream(Encoding.UTF8.GetBytes(node.ToString())); //make sure format looks right
            await _blobContainerClient.UploadBlobAsync(node.Id.ToString(), stream);
        }
    }

    [HttpGet]
    public IList<Node> Get(string name, Subject subject)
    {
        return new List<Node>();
    }
}
