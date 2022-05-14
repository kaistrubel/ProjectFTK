using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Azure;
using ProjectFTK.Extensions;
using ProjectFTK.Models;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// Add services to the container.
builder.Services.AddAuthentication(o =>
    {
        o.DefaultScheme = IdentityConstants.ExternalScheme;
        o.DefaultSignInScheme = IdentityConstants.ExternalScheme;
    })
    .AddCookie(IdentityConstants.ExternalScheme)
    .AddGoogle(googleOptions =>
    {
        googleOptions.ClientId = configuration["Authentication:Google:ClientId"];
        googleOptions.ClientSecret = configuration["Authentication:Google:ClientSecret"];
        googleOptions.SignInScheme = IdentityConstants.ExternalScheme;

        googleOptions.ClaimActions.MapJsonKey(GoogleClaims.PictureUrl, "picture", "url");
    });

builder.Services.AddAzureClients(cfg =>
{
    cfg.AddBlobServiceClient(configuration.GetSection("Blob")).WithCredential(new Azure.Identity.DefaultAzureCredential());

});

builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();
builder.Services.AddSpaStaticFiles();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseSpaStaticFiles(new StaticFileOptions { RequestPath = "/client-app/build" });

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}"); //rm =Home for react
app.MapRazorPages();

app.MapFallbackToFile("index.html");;

app.Run();

