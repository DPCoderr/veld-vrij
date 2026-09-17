using Microsoft.Extensions.Hosting;
using Scalar.Aspire;

var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres")
    .WithDataVolume(builder.Configuration["Postgres:VolumeName"])
    .WithPgAdmin(pgadmin => pgadmin.WithHostPort(5050));

var database = postgres.AddDatabase("db");

var api = builder.AddProject<Projects.Api>("api", launchProfileName: "https")
    .WithHttpHealthCheck("/health", endpointName: "https")
    .WithReference(database)
    .WaitFor(database);

// Run TanStack Start through Vite locally; production frontend hosting stays separate.
if (builder.ExecutionContext.IsRunMode)
{
    builder.AddViteApp("frontend", "../../frontend")
        // Match the frontend origins in the API's Development CORS settings.
        .WithEndpoint("http", endpoint => endpoint.Port = 3000)
        .WithExternalHttpEndpoints()
        .WithReference(api)
        .WithEnvironment("VITE_API_URL", api.GetEndpoint("https"))
        .WaitFor(api);
}

builder.AddScalarApiReference(options =>
    {
        options.PreferHttpsEndpoint();

        if (builder.Environment.IsDevelopment())
        {
            options.AllowSelfSignedCertificates();
        }
    })
    .WithApiReference(api)
    .WaitFor(api);

builder.Build().Run();
