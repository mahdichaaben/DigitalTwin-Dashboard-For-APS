namespace backend_dash.Infrastructure.Messaging;

public interface IComponent
{
    string TopicState { get; }
    void OnMessageReceived(string payload);
}
