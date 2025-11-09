using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace backend_dash.Infrastructure.Messaging;
    public class MqttDispatcher
    {
        private readonly MqttClient _mqttClient;
        private readonly ConcurrentDictionary<string, IComponent> _components = new();

        public MqttDispatcher(MqttClient mqttClient)
        {
            _mqttClient = mqttClient ?? throw new ArgumentNullException(nameof(mqttClient));
            _mqttClient.OnMessageReceived += HandleMqttMessageAsync;
        }

        public async Task RegisterComponentAsync(IComponent component)
        {
            if (component == null) throw new ArgumentNullException(nameof(component));

            _components[component.TopicState] = component;
            await _mqttClient.SubscribeAsync(component.TopicState);
        }

        private Task HandleMqttMessageAsync(string topic, string payload)
        {
            if (_components.TryGetValue(topic, out var component))
            {
                component.OnMessageReceived(payload);
            }
            else
            {
                Console.WriteLine($"[Warning] No registered component for topic '{topic}'");
            }

            return Task.CompletedTask;
        }

        public async Task PublishStateAsync(string topic, string stateMessage)
        {
            await _mqttClient.PublishAsync(topic, stateMessage);
        }
    }
