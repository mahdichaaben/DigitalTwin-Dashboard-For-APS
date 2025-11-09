using backend_dash.Services;
using backend_dash.WebApi.Dtos;
using backend_dash.WebApi.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using backend_dash.Services.Exceptions;
namespace backend_dash.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        private string GetAccessTokenFromHeader()
        {
            var authHeader = Request.Headers["Authorization"].ToString();

            if (string.IsNullOrWhiteSpace(authHeader) || !authHeader.StartsWith("Bearer "))
                throw new InvalidAccessTokenException();

            return authHeader.Replace("Bearer ", "").Trim();
        }



        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register([FromBody] UserRegisterRequest dto)
        {
            if (dto == null)
                return BadRequest("Invalid data.");

            try
            {
                var user = await _authService.RegisterAsync(dto.Username, dto.Email, dto.Password, dto.Role);
                return Ok(UserMapper.ToDto(user));
            }
            catch (UsernameTakenException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (EmailTakenException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch
            {
                return StatusCode(500, new { message = "An unexpected error occurred." });
            }
        }


        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] UserLoginRequest dto)
        {
            try
            {
                var tokens = await _authService.LoginAsync(dto.Username, dto.Password);
                return Ok(new LoginResponse(tokens.AccessToken, tokens.RefreshToken, tokens.ExpiresAt));
            }
            catch (InvalidCredentialsException)
            {
                return Unauthorized(new { message = "Invalid username or password." });
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, new { message = "An error occurred during login." });
            }
        }


        [HttpPost("refresh")]
        public async Task<ActionResult<LoginResponse>> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.RefreshToken))
                return BadRequest(new { message = "Refresh token is required." });

            try
            {
                var tokens = await _authService.RefreshTokenAsync(request.RefreshToken);

                return Ok(new LoginResponse(tokens.Value.AccessToken, tokens.Value.RefreshToken, tokens.Value.ExpiresAt));


            }
            catch (InvalidRefreshTokenException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }


        // -----------------------
        // Profile
        // -----------------------
        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                // Log headers for debugging
                Console.WriteLine("Authorization Header: " + Request.Headers["Authorization"]);

                // Extract token
                var token = GetAccessTokenFromHeader();
                Console.WriteLine("Extracted token: " + token);

                // Get user info from token
                var userInfo = _authService.GetUserInfoFromToken(token);
                Console.WriteLine($"UserId: {userInfo.UserId}, Username: {userInfo.Username}, Role: {userInfo.Role}");

                var jsonResult = new
                {
                    Id = userInfo.UserId,
                    Username = userInfo.Username,
                    Role = userInfo.Role
                };

                return Ok(jsonResult);
            }
            catch (InvalidAccessTokenException ex)
            {
                Console.WriteLine("InvalidAccessTokenException: " + ex.Message);
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Unexpected exception: " + ex);
                return StatusCode(500, new { message = "An unexpected error occurred." });
            }
        }



        // -----------------------
        // Logout
        // -----------------------
        [Authorize]
        [HttpPost("logout")]
        public async Task<ActionResult> Logout()
        {
            try
            {
                var accessToken = GetAccessTokenFromHeader();

                await _authService.LogoutAsync(accessToken);

                return Ok(new { message = "Logged out successfully." });
            }
            catch (InvalidAccessTokenException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }



        // -----------------------
        // Request/Response Records
        // -----------------------
        public record UserRegisterRequest(string Username, string Email, string Password, string Role = "Operator");
        public record UserLoginRequest(string Username, string Password);
        public record LoginResponse(string AccessToken, string RefreshToken, DateTime ExpiresAt);
        public record RefreshTokenRequest(string RefreshToken);
    }
}
