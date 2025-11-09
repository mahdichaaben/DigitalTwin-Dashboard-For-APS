using backend_dash.WebApi.Hubs;

namespace backend_dash.Domain.Events;

public class ModuleEventHandler
{

    private readonly DomainEventLogger _logger;
    public ModuleEventHandler( DomainEventLogger logger)
    {
        _logger = logger;
    }

    public void Subscribe(DigitalModule module)
    {
        module.Subscribe(OnModuleStatusChanged);
    }

    private void OnModuleStatusChanged(DigitalModule module)
    {
        // Log or dispatch real-time update
        Console.WriteLine($"[ModuleEventHandler] {module.SerialNumber} status changed: {module.Status}");

        _logger.LogModuleStatusChange(module);
    }
}
