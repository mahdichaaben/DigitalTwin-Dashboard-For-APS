using backend_dash.Domain;
using backend_dash.Repositories;
using backend_dash.Services.Exceptions;
using backend_dash.Services.Handlers;
using System.Security.Authentication;


namespace backend_dash.Services;
    public class AuthService
    {
        private readonly UserService _userService;
        private readonly JwtService _jwtService;

        public AuthService(UserService userService, JwtService jwtService)
        {
            _userService = userService;
            _jwtService = jwtService;
        }


    public async Task<User> RegisterAsync(string username, string email, string password, string role = "Operator")
    {
        var existingUserByUsername = await _userService.GetUserByUsernameAsync(username);
        if (existingUserByUsername != null)
            throw new UsernameTakenException(username);

        var existingUserByEmail = await _userService.GetUserByEmailAsync(email);
        if (existingUserByEmail != null)
            throw new EmailTakenException(email);

        var passwordHash = PasswordHashHandler.HashPassword(password);

        var user = await _userService.CreateUserAsync(username, email, role, passwordHash);

        return user;
    }


    public (string UserId, string Username, string Role, string? OriginId) GetUserInfoFromToken(string accessToken)
    {
        var userInfo = _jwtService.ExtractUserInfo(accessToken);

        if (userInfo == null)
        {
            Console.WriteLine("GetUserInfoFromToken: Invalid or expired token.");
            throw new InvalidAccessTokenException();
        }

        Console.WriteLine("GetUserInfoFromToken:");
        Console.WriteLine($"  UserId: {userInfo.Value.UserId}");
        Console.WriteLine($"  Username: {userInfo.Value.Username}");
        Console.WriteLine($"  Role: {userInfo.Value.Role}");
        Console.WriteLine($"  OriginId: {userInfo.Value.OriginId}");

        return userInfo.Value;
    }


    public async Task<(string AccessToken, string RefreshToken, DateTime ExpiresAt)> LoginAsync(string username, string password)
    {
        var user = await _userService.GetUserByUsernameAsync(username);
        if (user == null || !PasswordHashHandler.VerifyPassword(password, user.PasswordHash))
            throw new InvalidCredentialsException();

        // Generate a unique OriginId for this session
        var originId = Guid.NewGuid().ToString();

        // Generate token pair with this OriginId
        return await _jwtService.GenerateTokenPairAsync(user, originId);
    }

    public async Task<(string AccessToken, string RefreshToken, DateTime ExpiresAt)?> RefreshTokenAsync(string refreshToken)
        {
            return await _jwtService.RefreshTokenPairAsync(refreshToken);
        }

    // Logout

    public async Task LogoutAsync(string accessToken)
    {
        // Extract user info from token
        var userInfo = _jwtService.ExtractUserInfo(accessToken);
        if (userInfo == null)
            throw new InvalidAccessTokenException();

        var userId = userInfo.Value.UserId;

        // Invalidate the access token
        _jwtService.InvalidateAccessToken(accessToken);

        // Revoke all active refresh tokens for this user
        await _jwtService.RevokeRefreshTokensAsync(userId);

        Console.WriteLine($"User {userId} logged out successfully.");
    }

}
