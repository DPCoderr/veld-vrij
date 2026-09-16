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

// Run Next.js locally with Aspire; production frontend hosting stays separate.
if (builder.ExecutionContext.IsRunMode)
{
    // Aspire 13.5 marks the Next.js integration as experimental.
#pragma warning disable ASPIREJAVASCRIPT001
    builder.AddNextJsApp("frontend", "../../frontend")
        // Match the frontend origins in the API's Development CORS settings.
        .WithEndpoint("http", endpoint => endpoint.Port = 3000)
        .WithExternalHttpEndpoints()
        .WithReference(api)
        .WithEnvironment("NEXT_PUBLIC_API_URL", api.GetEndpoint("https"))
        .WaitFor(api);
#pragma warning restore ASPIREJAVASCRIPT001
}

var scalar = builder.AddScalarApiReference();

builder.Build().Run();
