using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ProjectFTK.Extensions;
using ProjectFTK.Services;

namespace ProjectFTK.Controllers;

public class AuthController : Controller
{
    public IActionResult GoogleLogin(bool isTeacher)
    {
        return new ChallengeResult(
            GoogleDefaults.AuthenticationScheme,
            new AuthenticationProperties
            {
                RedirectUri = Url.Action(nameof(GoogleResponse), "Auth", new { returnUrl = "/", isTeacher = isTeacher })
            });
    }
    

    public async Task<IActionResult> GoogleResponse(string returnUrl)
    {
        var authenticateResult = await HttpContext.AuthenticateAsync(IdentityConstants.ExternalScheme);
        if (!authenticateResult.Succeeded)
            return BadRequest();

        var claimsIdentity = new ClaimsIdentity(IdentityConstants.ApplicationScheme);

        claimsIdentity.AddClaim(authenticateResult.Principal.FindFirst(ClaimTypes.Name));
        claimsIdentity.AddClaim(authenticateResult.Principal.FindFirst(ClaimTypes.Email));
        claimsIdentity.AddClaim(authenticateResult.Principal.FindFirst(GoogleClaims.PictureUrl));

        if (Constants.ValidateTeacherEmail(authenticateResult.Principal.FindFirst(ClaimTypes.Email).Value))
        {
            claimsIdentity.AddClaim(new Claim(ClaimTypes.Role, CustomRoles.Teacher));
        }

        await HttpContext.SignInAsync(
            IdentityConstants.ExternalScheme,
            new ClaimsPrincipal(claimsIdentity),
            new AuthenticationProperties { IsPersistent = true, ExpiresUtc = DateTimeOffset.MaxValue }); // IsPersistent will set a cookie that lasts for two weeks (by default).

        return LocalRedirect(returnUrl);
    }

    public async Task<IActionResult> GoogleSignOut()
    {
        await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);
        return LocalRedirect("/");
    }
}
