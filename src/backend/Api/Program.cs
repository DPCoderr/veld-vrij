using Api.Data;
using Api.Models;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Use exact frontend origins; Render can set Cors__AllowedOrigins__0, etc.
var frontendOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? [];

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy => policy
        .WithOrigins(frontendOrigins)
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});

// Render sets RENDER=true and terminates HTTPS before forwarding HTTP to the API.
var isRender = builder.Configuration.GetValue<bool>("RENDER");
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.ForwardLimit = 1;

    if (isRender)
    {
        // Trust Render's ingress; this assumes requests reach the API through its proxy.
        // Keep the default trusted loopback proxies when running elsewhere.
        options.KnownIPNetworks.Clear();
        options.KnownProxies.Clear();
    }
});

// Aspire's WithReference(database) supplies ConnectionStrings:db to this API.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("db")
        ?? throw new InvalidOperationException(
            "The 'db' connection string is missing. Start the API through Aspire or configure ConnectionStrings:db.")));

// AddIdentity includes cookie authentication, roles, and SignInManager.
// AppUser and IdentityRole both use string keys; the DbContext must match.
builder.Services.AddIdentity<AppUser, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// Configure Identity's application cookie after registering Identity.
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.Name = "VeldVrij.Identity";
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Login requires HTTPS.
    // The frontend and Render API may be cross-site. Keep HTTPS and add CSRF
    // validation to future cookie-authenticated endpoints that change data.
    options.Cookie.SameSite = SameSiteMode.None;
    // API clients need status codes instead of redirects to login/access-denied pages.
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.CompletedTask;
    };
    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        return Task.CompletedTask;
    };
});

builder.Services.AddAuthorization();

builder.Services.AddOpenApi();

var app = builder.Build();

// Restore the original HTTPS scheme before redirects and authentication run.
app.UseForwardedHeaders();

// Apply existing migrations locally; apply production migrations during deployment.
if (app.Environment.IsDevelopment())
{
    await using var scope = app.Services.CreateAsyncScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();

    // If development seed data is added, seed it here after migrations finish.
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseRouting();
// Handle preflight requests before authentication and include CORS headers on 401/403.
app.UseCors("Frontend");
// Authenticate first so authorization can inspect the signed-in user.
app.UseAuthentication();
app.UseAuthorization();
// Protect private endpoints with RequireAuthorization() or [Authorize].

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
