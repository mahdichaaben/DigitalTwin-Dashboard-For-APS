using backend_dash.Domain;
using backend_dash.Repositories;
using backend_dash.Services.Exceptions;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace backend_dash.Services
{
    public class JwtService
    {
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly IConfiguration _configuration;

        // In-memory blacklist for revoked access tokens (can replace with DB later)
        private static readonly List<string> _accessTokenBlacklist = new();

        public JwtService(
            IUserRepository userRepository,
            IRefreshTokenRepository refreshTokenRepository,
            IConfiguration configuration)
        {
            _refreshTokenRepository = refreshTokenRepository;
            _configuration = configuration;
        }

        // Generate JWT + Refresh Token
        public async Task<(string AccessToken, string RefreshToken, DateTime ExpiresAt)> GenerateTokenPairAsync(User user, string originId)
        {
            var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(JwtRegisteredClaimNames.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim("originId", originId)  // <-- add this claim
                };

            var accessToken = GenerateAccessToken(claims);
            var refreshToken = GenerateRefreshToken();

            var refreshTokenEntity = new RefreshToken
            {
                Token = refreshToken,
                Expires = DateTime.UtcNow.AddDays(_configuration.GetValue<int>("JwtConfig:RefreshTokenExpirationDays")),
                UserAccountId = user.Id,
                Created = DateTime.UtcNow,
                OriginId = originId   // <-- associate refresh token with this session/origin
            };

            await _refreshTokenRepository.AddAsync(refreshTokenEntity);
            await _refreshTokenRepository.SaveChangesAsync();

            var accessTokenExpiration = DateTime.UtcNow.AddMinutes(
                _configuration.GetValue<int>("JwtConfig:AccessTokenExpirationMins"));

            return (accessToken, refreshToken, accessTokenExpiration);
        }

        // Refresh JWT pair
        public async Task<(string AccessToken, string RefreshToken, DateTime ExpiresAt)> RefreshTokenPairAsync(string refreshToken)
        {
            var storedToken = await _refreshTokenRepository.GetByTokenAsync(refreshToken);

            if (storedToken == null || !storedToken.IsActive)
                throw new InvalidRefreshTokenException();

            var user = storedToken.User;
            var originId = storedToken.OriginId; // preserve session

            // Revoke old token
            storedToken.Revoke();
            await _refreshTokenRepository.UpdateAsync(storedToken);

            // Generate new token pair
            var newTokenPair = await GenerateTokenPairAsync(user, originId);

            // Mark new refresh token as replacing the old one
            var newRefreshTokenEntity = await _refreshTokenRepository.GetByTokenAsync(newTokenPair.RefreshToken);
            if (newRefreshTokenEntity != null)
            {
                newRefreshTokenEntity.ReplacedByToken = refreshToken;
                await _refreshTokenRepository.UpdateAsync(newRefreshTokenEntity);
            }

            await _refreshTokenRepository.SaveChangesAsync();

            return newTokenPair;
        }

        // Blacklist an access token
        public void InvalidateAccessToken(string accessToken)
        {
            var jti = ExtractJti(accessToken);
            if (!string.IsNullOrEmpty(jti))
                _accessTokenBlacklist.Add(jti);
        }

        // Generate JWT token
        private string GenerateAccessToken(IEnumerable<Claim> claims)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtConfig:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var expires = DateTime.UtcNow.AddMinutes(_configuration.GetValue<int>("JwtConfig:AccessTokenExpirationMins"));

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtConfig:Issuer"],
                audience: _configuration["JwtConfig:Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Generate refresh token
        private string GenerateRefreshToken()
        {
            var randomBytes = RandomNumberGenerator.GetBytes(64);
            return Convert.ToBase64String(randomBytes);
        }

        // Validate JWT token
        public ClaimsPrincipal? ValidateAccessToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["JwtConfig:Key"]);

            try
            {
                var principal = tokenHandler.ValidateToken(token, new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _configuration["JwtConfig:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = _configuration["JwtConfig:Audience"],
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jti = principal.FindFirst(JwtRegisteredClaimNames.Jti)?.Value;
                if (!string.IsNullOrEmpty(jti) && _accessTokenBlacklist.Contains(jti))
                    return null;

                return principal;
            }
            catch
            {
                return null;
            }
        }

        // Revoke refresh tokens for a specific session/origin only
        public async Task RevokeRefreshTokensAsync(string userId, string? originId = null)
        {
            var tokens = await _refreshTokenRepository.GetByUserIdAsync(userId);

            foreach (var token in tokens.Where(t => t.IsActive && (originId == null || t.OriginId == originId)))
            {
                token.Revoke();
                await _refreshTokenRepository.UpdateAsync(token);
            }

            await _refreshTokenRepository.SaveChangesAsync();
        }

        // Extract user info from token
        public (string UserId, string Username, string Role, string? OriginId)? ExtractUserInfo(string token)
        {
            var principal = ValidateAccessToken(token);
            if (principal == null) return null;

            var userId = principal.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                         ?? principal.FindFirst(ClaimTypes.NameIdentifier)?.Value
                         ?? "";

            var username = principal.FindFirst(JwtRegisteredClaimNames.Name)?.Value ?? "";
            var role = principal.FindFirst(ClaimTypes.Role)?.Value ?? "";
            var originId = principal.FindFirst("originId")?.Value; // optional

            return (userId, username, role, originId);
        }


        // Helper to extract JTI
        private string? ExtractJti(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            return jwtToken?.Id;
        }
    }
}
