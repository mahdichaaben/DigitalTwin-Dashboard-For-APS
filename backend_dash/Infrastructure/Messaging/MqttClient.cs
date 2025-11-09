
using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Client.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace backend_dash.Infrastructure.Messaging;
public class MqttClient
{
    private readonly IMqttClient _client;
    private readonly IMqttClientOptions _options;

    // Event to notify when a new MQTT message is received
    public event Func<string, string, Task>? OnMessageReceived;

    public MqttClient(string brokerHost, int brokerPort, string clientId)
    {
        var factory = new MqttFactory();
        _client = factory.CreateMqttClient();

        _client.UseConnectedHandler(async e =>
        {
            Console.WriteLine("Connected successfully with MQTT Brokers.");

            // You can add default subscriptions here if needed
            // await _client.SubscribeAsync(new MqttTopicFilterBuilder()
            //    .WithTopic("test/topic")
            //    .Build());

            // Console.WriteLine("Subscribed to topic 'test/topic'");
        });

        _client.UseDisconnectedHandler(e =>
        {
            Console.WriteLine("Disconnected from MQTT Brokers.");
        });

        _client.UseApplicationMessageReceivedHandler(async e =>
        {
            var topic = e.ApplicationMessage.Topic;
            var payload = Encoding.UTF8.GetString(e.ApplicationMessage.Payload);

            Console.WriteLine($"Received message from topic '{topic}");

            if (OnMessageReceived != null)
            {
                await OnMessageReceived.Invoke(topic, payload);
            }
        });

        _options = new MqttClientOptionsBuilder()
            .WithClientId(clientId)
            .WithTcpServer(brokerHost, brokerPort)
            .WithCleanSession()
            .Build();
    }

    public async Task ConnectAsync()
    {
        if (!_client.IsConnected)
        {
            try
            {
                await _client.ConnectAsync(_options);
                Console.WriteLine("Connected successfully!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"MQTT connection failed: {ex.Message}");
            }
        }
    }

    public async Task DisconnectAsync()
    {
        if (_client.IsConnected)
        {
            await _client.DisconnectAsync();
        }
    }

    public async Task PublishAsync(string topic, string payload)
    {
        if (!_client.IsConnected)
        {
            Console.WriteLine("Client is not connected.");
            return;
        }

        var message = new MqttApplicationMessageBuilder()
            .WithTopic(topic)
            .WithPayload(payload)
            .WithExactlyOnceQoS()
            .WithRetainFlag(false)
            .Build();

        await _client.PublishAsync(message);
        Console.WriteLine($"Published message to topic '{topic}': {payload}");
    }

    public async Task SubscribeAsync(string topic)
    {
        if (!_client.IsConnected)
        {
            Console.WriteLine("Cannot subscribe. MQTT client is not connected.");
            return;
        }

        await _client.SubscribeAsync(new MQTTnet.Client.Subscribing.MqttClientSubscribeOptionsBuilder()
            .WithTopicFilter(topic)
            .Build());

        Console.WriteLine($"Subscribed to topic '{topic}'");
    }

    public async Task UnsubscribeAsync(string topic)
    {
        if (!_client.IsConnected)
        {
            Console.WriteLine("Cannot unsubscribe. MQTT client is not connected.");
            return;
        }

        await _client.UnsubscribeAsync(topic);

        Console.WriteLine($"Unsubscribed from topic '{topic}'");
    }
}
