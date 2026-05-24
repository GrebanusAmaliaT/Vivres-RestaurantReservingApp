using AplicatieRezervari.Server.DTOs;
using AplicatieRezervari.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace AplicatieRezervari.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _authService.RegisterAsync(registerDto);

        if (!result.IsSuccess)
            return BadRequest(new { message = result.Message });

        return Ok(new { message = result.Message });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _authService.LoginAsync(loginDto);

        if (!result.IsSuccess)
            return Unauthorized(new { message = result.Message });

        return Ok(new
        {
            token = result.Token,
            role = result.Role,
            cityId = result.CityId,
            message = result.Message
        });
    }
}