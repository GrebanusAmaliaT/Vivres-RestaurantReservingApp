using AplicatieRezervari.Server.DTOs;
using AplicatieRezervari.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace AplicatieRezervari.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger; 

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        try
        {
            var result = await _authService.RegisterAsync(registerDto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred during user registration.");

            return StatusCode(500, new { message = "An internal server error occurred. Please try again later." });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        try
        {
            var result = await _authService.LoginAsync(loginDto);

            if (!result.IsSuccess)
                return Unauthorized(new { message = result.Message });

            return Ok(new
            {
                token = result.Token,
                role = result.Role,
                cityId = result.CityId,
                message = result.Message,
                hasProfileCompleted = result.HasProfileCompleted
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred during user login.");
            return StatusCode(500, new { message = "An internal server error occurred. Please try again later." });
        }
    }
}