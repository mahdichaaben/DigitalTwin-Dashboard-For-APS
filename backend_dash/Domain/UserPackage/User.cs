using backend_dash.Domain;

public class User
{
    public string Id { get; set; } // EF needs setter
    public string Username { get; private set; }
    public string Email { get; private set; }
    public string Role { get; private set; }
    public DateTime CreatedAt { get; set; } // EF can set it

    public string PasswordHash { get; private set; }

    private readonly List<RefreshToken> _refreshTokens = new();
    public IReadOnlyCollection<RefreshToken> RefreshTokens => _refreshTokens.AsReadOnly();

    protected User() { } // for EF

    public User(string username, string email, string role, string passwordHash, string? id = null)
    {
        Id = id ?? Guid.NewGuid().ToString();
        Username = username;
        Email = email;
        Role = role;
        PasswordHash = passwordHash;
        CreatedAt = DateTime.UtcNow;
    }

    public void UpdatePassword(string newHash) => PasswordHash = newHash;

    public void UpdateRole(string newRole) => Role = newRole;

    public bool VerifyPassword(string providedHash) => PasswordHash == providedHash;
}
