using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectFTK.Extensions;
using ProjectFTK.Models;

namespace ProjectFTK.Controllers;

[Authorize(Roles = CustomRoles.Teacher)]
public class CurriculumController : Controller
{
    [HttpPost]
    public IActionResult Create(string name, Subject subject, IDictionary<string, IDictionary<string, string>> nodes)
    {
        return View();
    }
}

