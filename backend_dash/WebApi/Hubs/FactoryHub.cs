using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

public class FactoryHub : Hub
{
    private static readonly ConcurrentDictionary<string, HashSet<string>> _moduleGroups = new();

    private static readonly ConcurrentDictionary<string, HashSet<string>> _workpieceGroups = new();

    private static readonly ConcurrentDictionary<string, HashSet<string>> _alertGroups = new();

    public override async Task OnConnectedAsync()
    {
        try
        {
            Console.WriteLine($"[FactoryHub] Client connected: {Context.ConnectionId}");
            await base.OnConnectedAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[FactoryHub] Connection error: {ex}");
            throw;
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        Console.WriteLine($"[FactoryHub] Client disconnected: {Context.ConnectionId}");

        // Remove from all module groups
        foreach (var group in _moduleGroups.Values)
            group.Remove(Context.ConnectionId);

        // Remove from all workpiece groups
        foreach (var group in _workpieceGroups.Values)
            group.Remove(Context.ConnectionId);

        // Remove from all alert groups
        foreach (var group in _alertGroups.Values)
            group.Remove(Context.ConnectionId);

        await base.OnDisconnectedAsync(exception);
    }

    // Module Group Methods
    public async Task JoinModuleGroup(string moduleSerial)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, moduleSerial);
        _moduleGroups.TryAdd(moduleSerial, new HashSet<string>());
        _moduleGroups[moduleSerial].Add(Context.ConnectionId);

        Console.WriteLine($"[FactoryHub] Client {Context.ConnectionId} joined module group {moduleSerial}");
    }

    public async Task LeaveModuleGroup(string moduleSerial)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, moduleSerial);
        if (_moduleGroups.TryGetValue(moduleSerial, out var set))
            set.Remove(Context.ConnectionId);

        Console.WriteLine($"[FactoryHub] Client {Context.ConnectionId} left module group {moduleSerial}");
    }

    // Workpiece Group Methods
    public async Task JoinWorkpieceGroup(string workpieceId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, workpieceId);
        _workpieceGroups.TryAdd(workpieceId, new HashSet<string>());
        _workpieceGroups[workpieceId].Add(Context.ConnectionId);

        Console.WriteLine($"[FactoryHub] Client {Context.ConnectionId} joined workpiece group {workpieceId}");
    }

    public async Task LeaveWorkpieceGroup(string workpieceId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, workpieceId);
        if (_workpieceGroups.TryGetValue(workpieceId, out var set))
            set.Remove(Context.ConnectionId);

        Console.WriteLine($"[FactoryHub] Client {Context.ConnectionId} left workpiece group {workpieceId}");
    }
    public async Task JoinAlertGroup(string sensorId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, sensorId);
        _alertGroups.TryAdd(sensorId, new HashSet<string>());
        _alertGroups[sensorId].Add(Context.ConnectionId);

        Console.WriteLine($"[FactoryHub] Client {Context.ConnectionId} joined alert group for sensor {sensorId}");
    }

    public async Task LeaveAlertGroup(string sensorId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, sensorId);
        if (_alertGroups.TryGetValue(sensorId, out var set))
            set.Remove(Context.ConnectionId);

        Console.WriteLine($"[FactoryHub] Client {Context.ConnectionId} left alert group for sensor {sensorId}");
    }
    public static IReadOnlyDictionary<string, HashSet<string>> GetModuleGroupClients() => _moduleGroups;
    public static IReadOnlyDictionary<string, HashSet<string>> GetWorkpieceGroupClients() => _workpieceGroups;
    public static IReadOnlyDictionary<string, HashSet<string>> GetAlertGroupClients() => _alertGroups;
}