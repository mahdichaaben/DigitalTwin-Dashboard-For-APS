namespace backend_dash.Domain;

public class SensorLog
{
    // Composite key: sensor_id + timestamp
    public string SensorId { get; set; }         
    public DateTime Timestamp { get; set; }       

    public string ValueRaw { get; set; }          

    public double? ValueNumeric { get; set; }     

    public SensorLog(string sensorId, DateTime timestamp, string valueRaw, double? valueNumeric = null)
    {
        SensorId = sensorId;
        Timestamp = timestamp;
        ValueRaw = valueRaw;
        ValueNumeric = valueNumeric;
    }
}
