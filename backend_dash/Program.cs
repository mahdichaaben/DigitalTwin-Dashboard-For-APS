using backend_dash.Domain;
using backend_dash.Domain.Events;
using backend_dash.Infrastructure.Data;
using backend_dash.Infrastructure.Messaging;
using backend_dash.Infrastructure.Seed;
using backend_dash.Repositories;
using backend_dash.Repositories.implementations;
using backend_dash.Services;
using backend_dash.WebApi.Hubs;
using DotNetEnv;
using System.Text;


using Microsoft.AspNetCore.Authentication.JwtBearer;


using Microsoft.AspNetCore.Authentication;
using Microsoft.IdentityModel.Tokens;




using Microsoft.EntityFrameworkCore;
var builder = WebApplication.CreateBuilder(args);





Env.Load();

var dbHost = Environment.GetEnvironmentVariable("DB_HOST");
var dbPort = Environment.GetEnvironmentVariable("DB_PORT");
var dbUser = Environment.GetEnvironmentVariable("DB_USER");
var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");
var dbName = Environment.GetEnvironmentVariable("DB_NAME");
var connectionString = $"Host={dbHost};Port={dbPort};Username={dbUser};Password={dbPassword};Database={dbName}";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));


await PathManager.LoadPathsAsync();
//---Database-- -
//builder.Services.AddDbContext<AppDbContext>(options =>
//   options.UseInMemoryDatabase("aps_dashboard"));

// --- Singleton DigitalFactory ---
builder.Services.AddSingleton<DigitalFactory>(sp =>
{
    var factoryBuilder = new DigitalFactoryBuilder();
    return factoryBuilder.BuildFactory();
});



builder.Services.AddSingleton<MqttClient>(sp =>
{
    var brokerHost = "localhost"; 
    var brokerPort = 1883;
    var clientId = "aps_dashboard_client";

    var client = new MqttClient(brokerHost, brokerPort, clientId);

    // Connect immediately (fire-and-forget)
    _ = client.ConnectAsync();

    return client;
});

// --- Dispatcher ---
builder.Services.AddSingleton<MqttDispatcher>(sp =>
{
    var mqttClient = sp.GetRequiredService<MqttClient>();
    return new MqttDispatcher(mqttClient);
});


builder.Services.AddSignalR();
builder.Services.AddSingleton<ILogService, LogService>();
builder.Services.AddSingleton<RealTimeLogger>();
builder.Services.AddSingleton<DomainEventLogger>();
builder.Services.AddSingleton<ModuleEventHandler>();
builder.Services.AddSingleton<WorkpieceEventHandler>();


builder.Services.AddHostedService<DispatcherHostedService>();



builder.Services.AddSingleton<Executor>();

builder.Services.AddHostedService<OrderExecutorService>();


builder.Services.AddScoped<IWorkpieceRepository, WorkpieceRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IDigitalFactoryRepository, DigitalFactoryRepository>();


builder.Services.AddScoped<IWorkpieceLogRepository, WorkpieceLogRepository>();
builder.Services.AddScoped<IModuleLogRepository,ModuleLogRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();



builder.Services.AddScoped<ISensorRepository, SensorRepository>();
builder.Services.AddScoped<ISensorLogRepository, SensorLogRepository>();





builder.Services.AddScoped<WorkpieceService>();
builder.Services.AddScoped<OrderService>();
builder.Services.AddScoped<FactoryService>();

builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<UserService>();



builder.Services.AddScoped<ISensorService, SensorService>();
builder.Services.AddScoped<ISensorLogService, SensorLogService>();


builder.Services.AddScoped<IAlertService, AlertService>();
builder.Services.AddScoped<IAlertRepository, AlertRepository>();

// --- Controllers + Swagger ---
builder.Services.AddControllers();
builder.Services.AddSignalR().AddHubOptions<FactoryHub>(options =>
{
    options.EnableDetailedErrors = true;
});


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllClients", policy =>
    {

        //SetIsOriginAllowed(origin => true)

        // WithOrigins("http://localhost:5173")
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});




builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var key = Encoding.UTF8.GetBytes(builder.Configuration["JwtConfig:Key"]);
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["JwtConfig:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["JwtConfig:Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };

    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine($"Authentication failed: {context.Exception}");
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            Console.WriteLine("Token validated");
            return Task.CompletedTask;
        }
    };
});


var app = builder.Build();

// --- Seed Database & Register Factory Modules ---
// --- Seed Database & Register Factory Modules ---
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var factory = scope.ServiceProvider.GetRequiredService<DigitalFactory>();
    var mqttDispatcher = scope.ServiceProvider.GetRequiredService<MqttDispatcher>();
    var realTimeDispatcher = scope.ServiceProvider.GetRequiredService<RealTimeLogger>();

    // Seed database with singleton factory
    var seeder = new DigitalFactorySeeder(db, factory);
    seeder.Seed();


    var workpieceTypeSeeder = new WorkpieceTypeSeeder(db);
    await workpieceTypeSeeder.SeedAsync();

    // Then seed Workpieces


    var wpevent = scope.ServiceProvider.GetRequiredService<WorkpieceEventHandler>();

    var workpieceSeeder = new WorkpieceSeeder(db, wpevent);
    await workpieceSeeder.SeedAsync();



    var moduleEventHandler = scope.ServiceProvider.GetRequiredService<ModuleEventHandler>();


    foreach (var module in factory.DigitalModules)
    {
        moduleEventHandler.Subscribe(module);
    }

    await mqttDispatcher.RegisterFactoryModulesAsync(factory);




}







// --- Middleware ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Optional: only enable HTTPS redirection in production
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// --- Routing ---
app.UseRouting();

// --- CORS ---
app.UseCors("AllowAllClients");


// --- Authorization ---




app.UseAuthentication(); 
app.UseAuthorization();



// --- Endpoints ---
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapHub<FactoryHub>("/factoryhub");
});

app.Run();
