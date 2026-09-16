# API configuration

## Local development

Start the AppHost with Aspire. It supplies `ConnectionStrings:db` to the API,
which applies existing EF migrations automatically in Development.

The Development CORS policy allows `http://localhost:3000` and
`https://localhost:3000`. Use the API's HTTPS endpoint for cookie authentication.
Frontend requests must include `credentials: "include"` to send and receive cookies.

## Render

Set these environment variables on the API service:

| Variable | Value |
| --- | --- |
| `ASPNETCORE_ENVIRONMENT` | `Production` |
| `Cors__AllowedOrigins__0` | This project's exact frontend origin, such as `https://your-project.vercel.app`, without a trailing slash or path |
| `ConnectionStrings__db` | The production database connection string in Npgsql format (`Host=...;Database=...;Username=...;Password=...`) |

Use `Cors__AllowedOrigins__1`, etc. for additional trusted origins. No origins are
allowed by default outside Development. Do not use `*` with credentialed requests.
The tentative `https://vrijveld.nl` origin is commented out in `appsettings.json`
until the domain is confirmed.
Call the API's public HTTPS URL directly, including for CORS preflight requests.

Render automatically supplies `RENDER=true`. The API then trusts one hop of
`X-Forwarded-For` and `X-Forwarded-Proto` headers so HTTPS redirection and cookie
authentication see the original request scheme. This configuration assumes the
service is reached through Render's ingress proxy; do not set `RENDER=true` on
a directly exposed server. Other environments retain the default proxy allowlist.

The Identity cookie uses `SameSite=None; Secure; HttpOnly` for a frontend and API
hosted on different sites. Browsers may still block third-party cookies; a same-site
custom domain or frontend proxy avoids that restriction. CORS is not CSRF protection:
add antiforgery validation to future cookie-authenticated endpoints that change data.

Apply EF migrations as a deployment step in Production. Development seed data and
authentication endpoints have not been added.

References: [ASP.NET Core CORS](https://learn.microsoft.com/en-us/aspnet/core/security/cors?view=aspnetcore-10.0),
[forwarded headers](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/proxy-load-balancer?view=aspnetcore-10.0),
[Render environment variables](https://render.com/docs/environment-variables).
