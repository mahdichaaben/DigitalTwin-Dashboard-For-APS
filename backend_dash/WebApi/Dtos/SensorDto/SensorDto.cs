namespace backend_dash.WebApi.Dtos;


public class SensorLogDto
{
    public string SensorId { get; set; }
    public DateTime Timestamp { get; set; }
    public string ValueRaw { get; set; }
    public double? ValueNumeric { get; set; }
}

public class SensorDto
{
    public string SensorId { get; set; }
    public string Name { get; set; }
    public string SensorType { get; set; }
    public string Description { get; set; }
    public string Unit { get; set; }
    public double? MinValue { get; set; }
    public double? MaxValue { get; set; }
    public DateTime LastUpdate { get; set; }
    public bool IsActive { get; set; }
    public List<SensorLogDto> Logs { get; set; }
}