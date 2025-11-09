using backend_dash.Infrastructure.Messaging;
using Microsoft.Extensions.Hosting;
using System.Threading;
using System.Threading.Tasks;

public class DispatcherHostedService : BackgroundService
{
    private readonly MqttDispatcher _dispatcher;

    public DispatcherHostedService(MqttDispatcher dispatcher)
    {
        _dispatcher = dispatcher;
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Since Dispatcher is event-driven, we don't need a loop
        // Just keep it alive until app stops
        stoppingToken.Register(() =>
        {
            // Optional: cleanup if needed
        });

        return Task.CompletedTask;
    }
}
