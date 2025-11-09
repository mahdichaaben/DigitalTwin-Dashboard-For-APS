namespace backend_dash.Domain;

public class AlertEntity
{
    public required string AlertId { get; set; }           // Unique identifier (required)
    public string? DigitalModuleId { get; set; }           // Optional
    public string? AlertType { get; set; }                 // Optional
    public string? SensorId { get; set; }                  // Optional
    public string? Description { get; set; }               // Optional
    public string? StartedAt { get; set; }                 // Changed to string
    public string? EndedAt { get; set; }                   // Changed to string
    public required string Status { get; set; }            // Required
    public string? Summary { get; set; }                   // Optional
}

