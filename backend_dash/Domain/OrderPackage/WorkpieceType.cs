using System;
using System.Collections.Generic;

namespace backend_dash.Domain;
public class WorkpieceType
    {
        public string Id { get; }
        public string Name { get; set; }
        public string Color { get; set; }

        //public List<FixedModule> CompatibleModules { get; } = new();


    public List<Workpiece> Workpieces { get; } = new();  // <-- important, initialize!


    public List<WorkpieceTypeModule> ModuleLinks { get; } = new();


    public void AddCompatibleModule(FixedModule module, int order = 0)
    {
        if (module == null) return;
        if (!ModuleLinks.Any(l => l.FixedModule == module))
        {
            ModuleLinks.Add(new WorkpieceTypeModule(this, module, order));
           // module.AddCompatibleWorkpieceType(this);
        }
    }


    public IEnumerable<FixedModule> GetOrderedModules() =>
    ModuleLinks.OrderBy(l => l.Order).Select(l => l.FixedModule);



    protected WorkpieceType() { }
    public WorkpieceType(string id, string name, string color)
        {
            Id = id ?? Guid.NewGuid().ToString();
            Name = name;
            Color = color;
        }


    public void AddWorkpiece(Workpiece wp)
    {
        if (wp != null) Workpieces.Add(wp);
    }

    public override string ToString()
        {
            return $"WorkpieceType [Id={Id}, Name={Name}, Color={Color}, " ;
        }



    // Add a computed property for ordered modules



}
