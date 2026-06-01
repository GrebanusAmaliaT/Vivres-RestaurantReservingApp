using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AplicatieRezervari.Server.Data;
using AplicatieRezervari.Server.DTOs;
using AplicatieRezervari.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace AplicatieRezervari.Server.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthService> _logger;
    private readonly ApplicationDbContext _context;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        IConfiguration configuration,
        ILogger<AuthService> logger,
        ApplicationDbContext context)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _configuration = configuration;
        _logger = logger;
        _context = context;
    }

    public async Task<AuthResultDto> RegisterAsync(RegisterDto registerDto)
    {
        _logger.LogInformation("Attempting registration for email: {Email}", registerDto.Email);

        if (!await _roleManager.RoleExistsAsync(registerDto.Role))
        {
            return new AuthResultDto { IsSuccess = false, Message = "Role does not exist" };
        }

        var userExists = await _userManager.FindByEmailAsync(registerDto.Email);
        if (userExists != null)
        {
            return new AuthResultDto { IsSuccess = false, Message = "Email already registered" };
        }

        var user = new ApplicationUser
        {
            UserName = registerDto.Email,
            Email = registerDto.Email,
            FullName = registerDto.FullName,
            CityId = registerDto.CityId
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            return new AuthResultDto { IsSuccess = false, Message = $"Registration failed: {errors}" };
        }

        await _userManager.AddToRoleAsync(user, registerDto.Role);
        return new AuthResultDto { IsSuccess = true, Message = "User registered successfully" };
    }

    public async Task<AuthResultDto> LoginAsync(LoginDto loginDto)
    {
        _logger.LogInformation("Attempting login for email: {Email}", loginDto.Email);

        var user = await _userManager.FindByEmailAsync(loginDto.Email);

        if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
        {
            return new AuthResultDto
            {
                IsSuccess = false,
                Message = "Invalid email or password"
            };
        }

        var userRoles = await _userManager.GetRolesAsync(user);
        var primaryRole = userRoles.FirstOrDefault() ?? "Client";

        if (primaryRole == "RestaurantManager" || primaryRole == "Manager")
        {
            var hasRestaurantProfile = await _context.Restaurants
                .AnyAsync(r => r.ManagerId == user.Id);

            if (hasRestaurantProfile && !user.HasProfileCompleted)
            {
                user.HasProfileCompleted = true;
                await _userManager.UpdateAsync(user);
            }
        }

        var token = GenerateJwtToken(user, primaryRole);

        return new AuthResultDto
        {
            IsSuccess = true,
            Token = token,
            Role = primaryRole,
            CityId = user.CityId,
            Message = "Login successful",
            HasProfileCompleted = user.HasProfileCompleted
        };
    }
    private string GenerateJwtToken(ApplicationUser user, string role)
    {
        var authClaims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email!),
            new Claim(ClaimTypes.Role, role),
            new Claim("cityId", user.CityId?.ToString() ?? string.Empty)
        };

        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]!));

        var signingCredentials = new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            expires: DateTime.UtcNow.AddHours(3),
            claims: authClaims,
            signingCredentials: signingCredentials 
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}