using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace backend_dash.Domain;

public class FixedModule : DigitalModule
{
    public List<WorkpieceTypeModule> CompatibleWorkpieceTypesLinks { get; } = new();

    public List<TaskFixedModule> Proces { get; set; } = new();
    public string Position { get; private set; } = string.Empty;
    public FixedModule(string serialNumber, string topicState, string topicCommand, string name,string position)
        : base(serialNumber, topicState, topicCommand)
    {

        Name = name;

        Position = position;
    }

    public override void OnMessageReceived(string msg)
    {
        try
        {
            using var doc = JsonDocument.Parse(msg);
            var root = doc.RootElement;

            string? orderId = null;

            if (root.TryGetProperty("orderId", out var orderidProp))
                orderId = orderidProp.GetString();


            if (root.TryGetProperty("moduleState", out var modProp))
                ComponentState = modProp.GetString() ?? ComponentState;

            if (root.TryGetProperty("actionState", out var actionState) && actionState.ValueKind == JsonValueKind.Object)
            {
                var id = actionState.TryGetProperty("id", out var idProp)
                    ? idProp.GetString() ?? Guid.NewGuid().ToString()
                    : Guid.NewGuid().ToString();



                var command = actionState.TryGetProperty("command", out var cmdProp)
                    ? cmdProp.GetString() ?? "UNKNOWN"
                    : "UNKNOWN";

                var status = actionState.TryGetProperty("state", out var stateProp)
                    ? stateProp.GetString() ?? "UNKNOWN"
                    : "UNKNOWN";

                var metadata = new Dictionary<string, object>();
                if (actionState.TryGetProperty("metadata", out var metaProp) && metaProp.ValueKind == JsonValueKind.Object)
                {
                    foreach (var prop in metaProp.EnumerateObject())
                        metadata[prop.Name] = prop.Value.ValueKind switch
                        {
                            JsonValueKind.Number => prop.Value.GetDouble(),
                            JsonValueKind.String => prop.Value.GetString(),
                            JsonValueKind.True => true,
                            JsonValueKind.False => false,
                            _ => prop.Value.ToString()
                        };
                }

                var timestamp = root.TryGetProperty("timestamp", out var tsProp) && tsProp.ValueKind == JsonValueKind.String
                    ? tsProp.GetDateTime()
                    : DateTime.UtcNow;

                var action = new TaskCommand(id, command, status, orderId)
                {
                    Metadata = metadata,
                    Timestamp = timestamp,
                    Module = this
                    
                };


                UpdateWorkpieceFromMetadata(metadata, command, status,orderId);

                UpdateAction(action);

            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[ModuleComponent] Failed to process message: {ex.Message}");
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

        //ModuleLogger.LogAction(this, updatedAction);


        RaiseStatusChanged();
    }

    public void AddTask(TaskFixedModule task)
    {
        if (task == null)
            throw new ArgumentNullException(nameof(task));
        if (Proces.Any(t => t.Id == task.Id))
        {
            Console.WriteLine($"[FixedModule] Task with Id {task.Id} already exists in module {Name}.");
            return;
        }

        Proces.Add(task);
        task.FixedModule = this;
        Console.WriteLine($"[FixedModule] Task {task.Id} added to module {Name} at position {Position}.");
    }




    public void UpdateWorkpieceFromMetadata(
        Dictionary<string, object> metadata,
        string command,
        string status,
        string orderId) // pass the order id
    {
        if (metadata == null || !metadata.ContainsKey("id"))
        {
            Console.WriteLine("[FixedModule] Metadata does not contain a workpiece id.");
            return;
        }

        var wpId = metadata["id"]?.ToString();
        if (string.IsNullOrWhiteSpace(wpId))
        {
            Console.WriteLine("[FixedModule] Invalid workpiece id in metadata.");
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

        // Update module's current workpieces
        this.ClearWorkpieces();
        this.AddWorkpiece(wp);

        // Update workpiece state
        string tmp = $"{command} PIECE {status} BY {SerialNumber}";

        if (tmp.StartsWith("PICK PIECE FINISHED BY DPS"))
        {
            wp.State = "FREE"; // set state to free
            wp.Order = null;
            wp.LastProcessedModule = null;
        }
        else
        {
            wp.State = tmp; // otherwise, store the full command string as state
        }



        Console.WriteLine($"[FixedModule] Updated Workpiece {wp.Id} in Order {order.Id} → {wp.State}");
    }



}
