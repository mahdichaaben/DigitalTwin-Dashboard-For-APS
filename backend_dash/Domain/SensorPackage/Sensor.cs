namespace backend_dash.Domain;


public class Sensor
{
    public string SensorId { get; set; }           // Unique sensor identifier
    public string Name { get; set; }               // Human-readable name
    public string SensorType { get; set; }         // Type of sensor as string (e.g., "Temperature")
    public string Description { get; set; }        // Optional description
    public string Unit { get; set; }               // Measurement unit (°C, m/s², etc.)
    public double? MinValue { get; set; }          // Optional minimum threshold
    public double? MaxValue { get; set; }          // Optional maximum threshold
    public DateTime LastUpdate { get; set; }       // Last update timestamp
    public bool IsActive { get; set; } = true;     // Sensor active state
    public DigitalModule? DigitalModule { get; set; }

    // Sensor readings (logs)
    public List<SensorLog> Logs { get; set; } = new List<SensorLog>();
}