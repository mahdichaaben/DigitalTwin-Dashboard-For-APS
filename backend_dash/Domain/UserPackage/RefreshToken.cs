namespace backend_dash.Domain;


using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class RefreshToken
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Token { get; set; } = string.Empty;
    public DateTime Expires { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public DateTime? Revoked { get; set; }
    public string? ReplacedByToken { get; set; }

    public string UserAccountId { get; set; }  // matches User.Id typea

    public string? OriginId { get; set; }
    public virtual User User { get; set; }     // navigation property

    public bool IsActive => Revoked == null && Expires > DateTime.UtcNow;

    public void Revoke(string? replacedByToken = null)
    {
        Revoked = DateTime.UtcNow;
        ReplacedByToken = replacedByToken;
    }
}