using System.Text.Json;
namespace backend_dash.Domain;

public class StoreCommand : Command
{
    public string WorkpieceId { get; set; }
    public string Location { get; set; }
    public string Type { get; set; } = "RED";
    public string State { get; set; } = "RAW";

    public StoreCommand(
        string id,
        string commandName,
        string status,
        string orderId,
        string workpieceId,
        string location,
        string type = "RED",
        string state = "RAW"
    ) : base(id, commandName, status,orderId)
    {

        WorkpieceId = workpieceId ?? throw new ArgumentNullException(nameof(workpieceId));
        Location = location ?? throw new ArgumentNullException(nameof(location));
        Type = type;
        State = state;

    }

    public override string BuildPayload()
    {
        string hbwSerial = "SVR5H85409";

        var payload = new
        {
            id = Id,
            command = CommandName,
            status = Status,
            orderId = OrderId,
            hbwSerial = hbwSerial,
            workpieceId = WorkpieceId,
            location = Location,
            type = Type,
            state = State,
            metadata = Metadata,
            timestamp = Timestamp
        };

        return JsonSerializer.Serialize(payload);
    }

    public override string ToString()
    {
        return $"StorageCommand {Id}: {CommandName} [{Status}] - Workpiece {WorkpieceId} at {Location}";
    }
}
