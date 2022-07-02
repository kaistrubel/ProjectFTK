using Azure.Identity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Azure;
using MySql.Data.MySqlClient;
using ProjectFTK.Extensions;
using ProjectFTK.Services;

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
    cfg.AddBlobServiceClient(configuration.GetSection("Blob")).WithCredential(new DefaultAzureCredential());

});

/*
builder.Services.AddTransient<MySqlConnection>(cfg =>
    new MySqlConnection(configuration["MySQLConnection"])
);
*/
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "LocalHost",
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:3000");
                          policy.AllowCredentials();
                      });
});

builder.Services.AddSingleton(s =>
{
    CosmosClientOptions cosmosClientOptions = new CosmosClientOptions
    {
        MaxRetryAttemptsOnRateLimitedRequests = 3,
        MaxRetryWaitTimeOnRateLimitedRequests = TimeSpan.FromSeconds(60)
    };
    return new CosmosClient(configuration["CosmosDbConnection"]);
});

builder.Services.AddScoped<CosmosServices>();

builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();

//builder.Services.AddScoped<MySQLDbServices>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseCors("LocalHost");

    app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}"); //rm =Home for react
}
else
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();

    app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action}/{id?}"); //rm =Home for react
}

app.MapRazorPages();

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseResponseCaching();

app.MapFallbackToFile("index.html");;

app.Run();

