using backend_dash.Services;
using backend_dash.WebApi.Dtos;
using backend_dash.WebApi.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend_dash.Services.Exceptions;

namespace backend_dash.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly AuthService _authService;

        public UserController(UserService userService, AuthService authService)
        {
            _userService = userService;
            _authService = authService;
        }

        // -----------------------
        // Get all users (Admin only)
        // -----------------------
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<UserDto>>> GetAllUsers()
        {
            try
            {
                var (currentUserId, _, currentUserRole, _) = GetUserInfoFromToken();

                if (currentUserRole != "Admin")
                    return Forbid();

                var users = await _userService.GetAllUsersAsync();
                return Ok(UserMapper.ToDtoList(users));
            }
            catch (InvalidAccessTokenException)
            {
                return Unauthorized(new { message = "Invalid or expired token." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        private string GetAccessTokenFromHeader()
        {
            var authHeader = Request.Headers["Authorization"].ToString();

            if (string.IsNullOrWhiteSpace(authHeader) || !authHeader.StartsWith("Bearer "))
                throw new InvalidAccessTokenException();

            return authHeader.Replace("Bearer ", "").Trim();
        }

        // -----------------------
        // Helper: Extract user info from token
        // -----------------------
        private (string UserId, string Username, string Role, string? OriginId) GetUserInfoFromToken()
        {
            var token = GetAccessTokenFromHeader();
            return _authService.GetUserInfoFromToken(token);
        }

        // -----------------------
        // Get user by Id
        // -----------------------
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUserById(string id)
        {
            try
            {
                var (currentUserId, _, currentUserRole, _) = GetUserInfoFromToken();

                if (currentUserRole != "Admin" && currentUserId != id)
                    return Forbid();

                var user = await _userService.GetUserByIdAsync(id);
                if (user == null) return NotFound("User not found.");

                return Ok(UserMapper.ToDto(user));
            }
            catch (InvalidAccessTokenException)
            {
                return Unauthorized(new { message = "Invalid or expired token." });
            }
        }

        // -----------------------
        // Update password
        // -----------------------
        [Authorize]
        [HttpPut("{id}/password")]
        public async Task<ActionResult> UpdatePassword(string id, [FromBody] UpdatePasswordDto dto)
        {
            try
            {
                var (currentUserId, _, currentUserRole, _) = GetUserInfoFromToken();

                if (currentUserRole != "Admin" && currentUserId != id)
                    return Forbid();

                await _userService.UpdatePasswordAsync(id, dto.CurrentPassword, dto.NewPassword);
                return Ok("Password updated successfully.");
            }
            catch (InvalidAccessTokenException)
            {
                return Unauthorized(new { message = "Invalid or expired token." });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // -----------------------
        // DTOs
        // -----------------------
        public record UpdatePasswordDto(string CurrentPassword, string NewPassword);
    }
}