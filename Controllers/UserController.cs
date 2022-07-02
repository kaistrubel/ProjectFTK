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
                identity.Name,
                Email = identity.Email(),
                PictureUrl = identity.PictureUrl(),
                Roles = identity.Roles(),
                identity.IsAuthenticated
            });

            return userDate;
        }
    }
}

