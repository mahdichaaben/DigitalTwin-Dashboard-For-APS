using System;
using System.Collections.Generic;
using System.Text.Json;
using backend_dash.Infrastructure.Messaging;

namespace backend_dash.Domain;


public abstract class DigitalModule : IComponent
{


    public string SerialNumber { get; protected set; }
    public string Name { get; set; }
    public string TopicState { get; protected set; }
    public string TopicCommand { get; protected set; }
    public string Status { get; protected set; } = "FINISHED";

    public string ComponentState { get; protected set; } = "IDLE";
    public Command? CurrentAction { get; protected set; }


    public List<Workpiece> CurrentWorkpieces { get; set; } = new();

    //public List<WorkpieceType> CompatibleWorkpieceTypes { get; } = new();


    //public void AddCompatibleWorkpieceType(WorkpieceType type)
    //{
    //    if (!CompatibleWorkpieceTypes.Contains(type))
    //    {
    //        CompatibleWorkpieceTypes.Add(type);
    //    }
    //}

    public DigitalFactory factory { get; set; }

    // History of all actions
    public List<Command> ActionHistory { get; } = new();

    // Event for status changes
    public event Action<DigitalModule>? OnStatusChanged;

    public DigitalModule(string serialNumber, string topicState, string topicCommand)
    {
        SerialNumber = serialNumber;
        TopicState = topicState;
        TopicCommand = topicCommand;

        ComponentState = "IDLE";
    }
    public abstract void OnMessageReceived(string msg);

    public void Subscribe(Action<DigitalModule> handler) => OnStatusChanged += handler;
    public void Unsubscribe(Action<DigitalModule> handler) => OnStatusChanged -= handler;

    protected void RaiseStatusChanged() => OnStatusChanged?.Invoke(this);
        
    public void AddAction(Command action)
    {
        ActionHistory.Add(action);
    }



    protected abstract void UpdateAction(Command updatedAction);



    public void AddWorkpiece(Workpiece wp)
    {
        if (!CurrentWorkpieces.Contains(wp))
        {

            CurrentWorkpieces.Add(wp);

            wp.LastProcessedModule = this;

        }
            



    }

    public void RemoveWorkpiece(Workpiece wp)
    {
        CurrentWorkpieces.Remove(wp);
    }

    public void ClearWorkpieces()
    {
        CurrentWorkpieces.Clear();
    }

}
