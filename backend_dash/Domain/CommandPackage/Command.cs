using System;
using System.Collections.Generic;
using System.Text.Json;

namespace backend_dash.Domain;

public abstract class Command
{
    public string Id { get; set; }               
    public string CommandName { get; set; }          
    public string Status { get; set; }


    public Order? Order { get; set; }            
    public string? OrderId { get; set; }        


    public Dictionary<string, object> Metadata { get; set; } = new();
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    public int OrderUpdateId { get; set; }

    public DigitalModule? Module { get; set; }



    protected Command() { }

    protected Command(string id, string command, string state ,string orderId)
    {
        Id = id ?? throw new ArgumentNullException(nameof(id));
        CommandName = command ?? throw new ArgumentNullException(nameof(command));
        Status = state ?? throw new ArgumentNullException(nameof(state));
        OrderId= orderId ?? throw new ArgumentNullException(nameof(state));
    }

    // Force subclasses to implement payload creation
    public abstract string BuildPayload();

    public override string ToString()
    {
        return $"Action {Id}: {CommandName} [{Status}] - Metadata: {Metadata.Count} items";
    }
}