namespace backend_dash.WebApi.Dtos;

public class ModuleDto
{
    public string SerialNumber { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string State { get; set; } = "IDLE";
    public string Status { get; set; } = "FINISHED";
    public string ModuleType { get; set; } = "DigitalModule";
    public int CurrentWorkpiecesCount { get; set; }
    public List<string> CurrentWorkpieceIds { get; set; } = new();
    public string? CurrentPosition { get; set; } 
    public string? CurrentCommand { get; set; }
    public string? CurrentStatus { get; set; }
}
