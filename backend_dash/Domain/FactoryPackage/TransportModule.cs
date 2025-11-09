using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace backend_dash.Domain;

public class TransportModule : DigitalModule
{
    public string CurrentPosition { get; private set; } = string.Empty;

    public TransportModule(string serialNumber, string topicState, string topicCommand, string name)
        : base(serialNumber, topicState, topicCommand)
    {
        Name = name;
    }

    public override void OnMessageReceived(string msg)
    {
        try
        {
            Console.WriteLine("[AGV Received] " + msg);

            if (msg.StartsWith("\"") && msg.EndsWith("\""))
                msg = JsonSerializer.Deserialize<string>(msg) ?? msg;

            using var doc = JsonDocument.Parse(msg);
            var root = doc.RootElement;

            if (root.TryGetProperty("description", out var modProp))
                ComponentState = modProp.GetString() ?? ComponentState;



            // Extract action info
            string actionId = root.TryGetProperty("id", out var idProp)
                ? idProp.GetString() ?? Guid.NewGuid().ToString()
                : Guid.NewGuid().ToString();

 
            string command = root.TryGetProperty("command", out var cmdProp)
                ? cmdProp.GetString() ?? "UNKNOWN"
                : "UNKNOWN";

            string orderId = root.TryGetProperty("orderId", out var orderProp)
                ? orderProp.GetString() ?? Guid.NewGuid().ToString()
                : Guid.NewGuid().ToString();

            string state = "UNKNOWN";
            if (root.TryGetProperty("actionState", out var actionStateProp) && actionStateProp.ValueKind == JsonValueKind.Object)
            {
                state = actionStateProp.TryGetProperty("state", out var stProp)
                    ? stProp.GetString()?.ToUpperInvariant() ?? "RUNNING"
                    : "RUNNING";
            }

            // Metadata
            var nodes_metadata = root.GetProperty("nodes").EnumerateArray();

            var metadata = new Dictionary<string, object>();

            foreach (var node in nodes_metadata)
            {
                if (node.TryGetProperty("action", out var actionProp) && actionProp.ValueKind == JsonValueKind.Object)
                {
                    var metadataDict = new Dictionary<string, object>();

                    if (actionProp.TryGetProperty("metadata", out var metaProp) && metaProp.ValueKind == JsonValueKind.Object)
                    {
                        foreach (var prop in metaProp.EnumerateObject())
                        {
                            metadataDict[prop.Name] = prop.Value.ToString() ?? "";
                        }
                    }

                    metadata = metadataDict;

                    // Now metadataDict contains the metadata for this node's action
                    Console.WriteLine($"Node {node.GetProperty("id").GetString()} metadata: {string.Join(", ", metadataDict.Select(kv => kv.Key + "=" + kv.Value))}");
                }
            }


            // Timestamp
            var timestamp = root.TryGetProperty("timestamp", out var tsProp) && tsProp.ValueKind == JsonValueKind.String
                ? tsProp.GetDateTime()
                : DateTime.UtcNow;

            // Extract from/to nodes
            string fromNode = "";
            string toNode = "";

            if (root.TryGetProperty("nodes", out var nodes) && nodes.ValueKind == JsonValueKind.Array && nodes.GetArrayLength() > 0)
            {
                var firstNode = nodes[0];
                var lastNode = nodes[nodes.GetArrayLength() - 1];

                if (firstNode.TryGetProperty("id", out var fromProp))
                    fromNode = fromProp.GetString() ?? "";

                if (lastNode.TryGetProperty("id", out var toProp))
                    toNode = toProp.GetString() ?? "";
            }



            var action = new TransportCommand(actionId, command, state,orderId, fromNode, toNode)
            {
                Module = this,
                Metadata = metadata,
                Timestamp = timestamp
            };


            if (state == "RUNNING")
                CurrentPosition = fromNode;
            else if (state == "FINISHED")
                CurrentPosition = toNode;


            UpdateWorkpieceFromMetadata(metadata, command, state,orderId);


            UpdateAction(action);

        }
        catch (Exception ex)
        {
            Console.WriteLine($"[TransportModule] Failed to process message: {ex.Message}");
        }
    }


    protected override void UpdateAction(Command updatedAction)
    {


        if (updatedAction == null) return;

        var existing = ActionHistory.FirstOrDefault(a => a.Id == updatedAction.Id);
        if (existing != null)
        {
            existing.Status = updatedAction.Status;
            existing.Metadata = updatedAction.Metadata;
            existing.Timestamp = updatedAction.Timestamp;


            CurrentAction = existing;
        }
        else
        {
            ActionHistory.Add(updatedAction);
            CurrentAction = updatedAction;
        }

        Status = CurrentAction.Status;

              //  ModuleLogger.LogAction(this, updatedAction);


        RaiseStatusChanged();

        Console.WriteLine($"[TransportModule] {Name} Status: {Status}, CurrentAction: {CurrentAction?.Status}");

    }





    private void UpdateWorkpieceFromMetadata(Dictionary<string, object> metadata, string command, string status,string orderId)
    {
        if (metadata == null || !metadata.ContainsKey("id"))
        {
            Console.WriteLine("[TransportModule] Metadata does not contain a workpiece id.");
            return;
        }

        var wpId = metadata["id"]?.ToString();
        if (string.IsNullOrWhiteSpace(wpId))
        {
            Console.WriteLine("[TransportModule] Invalid workpiece id in metadata.");
            return;
        }

        // Find the order first
        var order = factory.Orders.FirstOrDefault(o => o.Id == orderId);
        if (order == null)
        {
            Console.WriteLine($"[FixedModule] Order with Id {orderId} not found in factory.");
            return;
        }

        // Now find the workpiece inside that order
        var wp = order.Workpieces.FirstOrDefault(w => w.Id == wpId);
        if (wp == null)
        {
            Console.WriteLine($"[FixedModule] Workpiece with Id {wpId} not found in Order {order.Id}.");
            return;
        }


        if (wp == null)
        {
            Console.WriteLine($"[TransportModule] Workpiece with Id {wpId} not found.");
            return;
        }


        this.ClearWorkpieces();
        // Add the workpiece to the module's current list
   //     this.AddWorkpiece(wp);

        // Add the workpiece to the module's current list

        wp.State = $"{command} PIECE {status} BY {SerialNumber}";


        this.AddWorkpiece(wp);


        Console.WriteLine($"[TransportModule] Updated Workpiece {wp.Id} state → {wp.State}");
    }
}
