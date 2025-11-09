namespace backend_dash.WebApi.Dtos;

public class GrafanaWebhook
{
    public string Receiver { get; set; }
    public List<GrafanaAlert> Alerts { get; set; }
}

public class GrafanaAlert
{
    public string Status { get; set; }
    public Dictionary<string, string> Labels { get; set; }
    public Dictionary<string, string> Annotations { get; set; }
    public string StartsAt { get; set; }   // raw string from JSON
    public string EndsAt { get; set; }     // raw string from JSON
    public string Fingerprint { get; set; }
}
