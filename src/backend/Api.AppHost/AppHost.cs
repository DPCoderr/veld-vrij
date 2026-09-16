using Scalar.Aspire;

var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres")
    .WithDataVolume()
    .WithPgAdmin(pgadmin => pgadmin.WithHostPort(5050));

var database = postgres.AddDatabase("db");

builder.AddProject<Projects.Api>("api")
    .WithReference(database)
    .WaitFor(database);

var scalar = builder.AddScalarApiReference();

builder.Build().Run();
