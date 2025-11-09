using backend_dash.Domain;
using backend_dash.Infrastructure.Messaging;

public class Executor
{
    private readonly MqttDispatcher _dispatcher;

    public Executor(MqttDispatcher dispatcher)
    {
        _dispatcher = dispatcher ?? throw new ArgumentNullException(nameof(dispatcher));
    }

    // Send a single command
    public async Task SendCommandAsync(Command action)
    {
        try
        {
            string payloadJson = action.BuildPayload();
            await _dispatcher.PublishStateAsync(action.Module.TopicCommand, payloadJson);

            Console.WriteLine($"[Executor] Sent command {action.CommandName} to {action.Module.Name} ({action.Module.SerialNumber})");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Executor] Failed to send command {action.Id}: {ex.Message}");
        }
    }

    public async Task ProcessCommandsSequentiallyAsync(IEnumerable<Command> actions, CancellationToken ct = default)
    {
        foreach (var action in actions)
        {
            if (action.Module == null)
            {
                Console.WriteLine($"Action {action.Id} has no module assigned!");
                continue;
            }

            var tcs = new TaskCompletionSource<bool>(TaskCreationOptions.RunContinuationsAsynchronously);

            void Handler(DigitalModule comp)
            {
                if (comp.CurrentAction?.Status == "FINISHED")
                    tcs.TrySetResult(true);
            }

            action.Module.OnStatusChanged += Handler;

            await SendCommandAsync(action);

            var completedTask = await Task.WhenAny(tcs.Task, Task.Delay(TimeSpan.FromSeconds(30), ct));
            if (completedTask != tcs.Task)
            {
                Console.WriteLine($"⚠️ Timeout while waiting for {action.Id}");
            }

            action.Module.OnStatusChanged -= Handler;

            Console.WriteLine($"[Executor] Action {action.Id} finished on {action.Module.Name}");
        }
    }

   
}
