using System;

namespace backend_dash.Domain;

public class UserAccess
{
    public string UserId { get; set; }
    public string FactoryId { get; set; }

    public bool HasAccess { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; }
    public DigitalFactory Factory { get; set; }

    public UserAccess() { }

    public UserAccess(string userId, string factoryId, bool hasAccess = false)
    {
        UserId = userId;
        FactoryId = factoryId;
        HasAccess = hasAccess;
    }
}
