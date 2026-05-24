using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using AplicatieRezervari.Server.Data;
using AplicatieRezervari.Server.Models;
using AplicatieRezervari.Server.Repositories;
using AplicatieRezervari.Server.Services;

using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using AplicatieRezervari.Server.Middleware;

namespace AplicatieRezervari.Server;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // 1. Configurare Bază de Date
        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

        // Register Repositories
        builder.Services.AddScoped<ICityRepository, CityRepository>();
        builder.Services.AddScoped<IRestaurantRepository, RestaurantRepository>();

        // Register Services
        builder.Services.AddScoped<ICityService, CityService>();
        builder.Services.AddScoped<IRestaurantService, RestaurantService>();
        builder.Services.AddScoped<IAuthService, AuthService>();

        // 2. Configurare ASP.NET Core Identity
        builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
        {
            options.Password.RequireDigit = false;
            options.Password.RequiredLength = 6;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = false;
            options.Password.RequireLowercase = false;
        })
        .AddEntityFrameworkStores<ApplicationDbContext>()
        .AddDefaultTokenProviders();

        // Add JWT Authentication
        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidAudience = builder.Configuration["Jwt:Audience"],
                ValidIssuer = builder.Configuration["Jwt:Issuer"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]!)),
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };
        });

        // 3. Configurare CORS pentru React (Vite)
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowReactApp", policy =>
            {
                policy.WithOrigins("https://localhost:5173")
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();
            });
        });

        // 4. Adăugare Servicii Core (.NET Controllers & Swagger)
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();


        builder.Services.AddScoped<IReservationRepository, ReservationRepository>();
        builder.Services.AddScoped<IReservationService, ReservationService>();


        var app = builder.Build();

        app.UseMiddleware<ExceptionMiddleware>();

        // 5. Configurare Pipeline pentru HTTP Request
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseDefaultFiles();
        app.UseStaticFiles();

        // --- ATENȚIE LA ORDINEA DE MAI JOS ---

        // CORS trebuie să fie primul pentru ca browserul să accepte cererile de la React
        app.UseCors("AllowReactApp");

        // Autentificarea verifică cine este utilizatorul
        app.UseAuthentication();

        // Autorizarea verifică dacă utilizatorul are dreptul să acceseze resursa
        app.UseAuthorization();

        // Rutele se mapează abia după filtrele de securitate
        app.MapControllers();
        app.MapFallbackToFile("/index.html");

        using (var scope = app.Services.CreateScope())
        {
            var services = scope.ServiceProvider;
            try
            {
                var context = services.GetRequiredService<ApplicationDbContext>();
                var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
                var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();

                DbSeeder.SeedDataAsync(context, roleManager, userManager).Wait();
            }
            catch (Exception ex)
            {
                var logger = services.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "O eroare a avut loc la popularea bazei de date.");
            }
        }

        app.Run();
    }
}