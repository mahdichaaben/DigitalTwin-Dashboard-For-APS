using System;

namespace backend_dash.Domain
{
    public class Workpiece
    {
        public string Id { get; }

        public string TypeId { get; set; }

        public WorkpieceType Type { get; set; }

        public Order? Order { get; set; }


        private string _state = "FREE";

        public string State
        {
            get => _state;
            set
            {
                if (_state != value)
                {
                    _state = value;
                    RaiseStateChanged();
                }
            }
        }

        public DateTime AddedAt { get; } = DateTime.UtcNow;

        // Event for state changes
        public event Action<Workpiece>? OnStateChanged;


        public DigitalModule? LastProcessedModule { get; set; }



        protected Workpiece() { }

        public Workpiece(string id, WorkpieceType type, string state = "FREE")
        {
            Id = id ?? throw new ArgumentNullException(nameof(id));
            Type = type ?? throw new ArgumentNullException(nameof(type));
            _state = state;
        }

        // Subscribe a handler to state changes
        public void Subscribe(Action<Workpiece> handler) => OnStateChanged += handler;

        // Unsubscribe a handler
        public void Unsubscribe(Action<Workpiece> handler) => OnStateChanged -= handler;

        // Raise the event
        protected void RaiseStateChanged() => OnStateChanged?.Invoke(this);

        public override string ToString()
        {
            return $"Workpiece [Id={Id}, Type={Type.Name}, State={State}, AddedAt={AddedAt:u}]";
        }
    }
}
