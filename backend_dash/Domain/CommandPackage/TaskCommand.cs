using System;
using System.Text.Json;

namespace backend_dash.Domain;

public class TaskCommand : Command
{
    public Dictionary<string, object> ActionExtraFields { get; } = new();


    protected TaskCommand() { }
    public TaskCommand(string id, string command, string state, string orderId)
        : base(id, command, state,orderId)
    {
    }

    public override string BuildPayload()
    {
        if (Module == null)
            throw new InvalidOperationException("Module must be assigned to build payload.");

        var actionDict = new Dictionary<string, object>
    {
        { "id", Id },
        { "command", CommandName },
        { "metadata", Metadata }
    };

        // Merge extra fields
        foreach (var kvp in ActionExtraFields)
        {
            actionDict[kvp.Key] = kvp.Value; // overwrite if same key exists
        }

        // Create the full payload
        var payloadMessage = new
        {
            serialNumber = Module.SerialNumber,
            orderId = OrderId,
            orderUpdateId = OrderUpdateId,
            action = actionDict
        };

        return JsonSerializer.Serialize(payloadMessage);
    }

}
