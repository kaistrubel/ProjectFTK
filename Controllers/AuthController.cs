using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ProjectFTK.Controllers
{
    public class AuthController : Controller
    {
        public IActionResult GoogleLogin(string returnUrl) =>
        new ChallengeResult(
            GoogleDefaults.AuthenticationScheme,
            new AuthenticationProperties
            {
                RedirectUri = Url.Action(nameof(GoogleResponse), "Auth")
            });

        public async Task<IActionResult> GoogleResponse(string returnUrl)
        {
            var authenticateResult = await HttpContext.AuthenticateAsync(IdentityConstants.ExternalScheme);

            if (!authenticateResult.Succeeded)
                return BadRequest();

            var claimsIdentity = new ClaimsIdentity(IdentityConstants.ApplicationScheme);

            claimsIdentity.AddClaim(authenticateResult.Principal.FindFirst(ClaimTypes.Name));
            claimsIdentity.AddClaim(authenticateResult.Principal.FindFirst(ClaimTypes.Email));

            await HttpContext.SignInAsync(
                IdentityConstants.ApplicationScheme,
                new ClaimsPrincipal(claimsIdentity),
                new AuthenticationProperties { IsPersistent = true }); // IsPersistent will set a cookie that lasts for two weeks (by default).

            return LocalRedirect("/");
        }
    }
}