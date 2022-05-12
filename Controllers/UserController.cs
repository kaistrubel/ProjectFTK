using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProjectFTK.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace ProjectFTK.Controllers
{
    public class UserController : Controller
    {
        [HttpGet]
        public IActionResult Info()
        {
            var identity = User.Identity;
            var userDate = new JsonResult(new
            {
                Name = identity.Name,
                Email = identity.Email(),
                Roles = identity.Roles()
            });

            return userDate;
        }
    }
}

