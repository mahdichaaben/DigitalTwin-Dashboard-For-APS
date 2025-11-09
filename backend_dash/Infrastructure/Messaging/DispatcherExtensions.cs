using backend_dash.Domain;

namespace backend_dash.Infrastructure.Messaging;

public static class DispatcherExtensions
{
    public static async Task RegisterFactoryModulesAsync(this MqttDispatcher dispatcher, DigitalFactory factory)
    {
        if (dispatcher == null) throw new ArgumentNullException(nameof(dispatcher));
        if (factory == null) throw new ArgumentNullException(nameof(factory));

        foreach (var module in factory.DigitalModules)
        {
            await dispatcher.RegisterComponentAsync(module);
        }
    }
}
