using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System;
using System.Collections.Generic;
using System.Linq;

namespace backend_dash.Domain;

public abstract class Order
    {
        public string Id { get; set; }

        public List<Command> Commands { get; } = new();
        public string Status { get; set; } = "PENDING";

        public List<Workpiece> Workpieces { get; set; } = new();
        public DateTime CreatedAt { get; set; }
        public string? RequestedBy { get; set; }

    public DigitalFactory Factory { get; set; }


    protected Order()
    {
        Id = Guid.NewGuid().ToString();
        CreatedAt = DateTime.UtcNow;
    }
    protected Order(string? id = null, string? requestedBy = null)
    {
        Id = string.IsNullOrWhiteSpace(id) ? Guid.NewGuid().ToString() : id;
        CreatedAt = DateTime.UtcNow;
        RequestedBy = requestedBy;
        
    }



    public abstract void GenerateCommands();




    public void AddWorkpiecesRange(IEnumerable<Workpiece> workpieces)
    {
        foreach (var wp in workpieces)
        {

                Workpieces.Add(wp);
                wp.Order = this;
            Console.WriteLine($"Workpiece {wp.Id} assigned to Order {wp.Order.Id}");


        }
    }


    public override string ToString()
        {
            return $"Order [Id={Id}, Status={Status}, CreatedAt={CreatedAt:u}, Commands={Commands.Count}]";
        }
    }
