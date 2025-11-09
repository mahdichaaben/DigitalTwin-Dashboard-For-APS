namespace backend_dash.Domain;

public class WorkpieceTypeModule
{
    public string WorkpieceTypeId { get; set; }
    public WorkpieceType WorkpieceType { get; set; }

    public string FixedModuleId { get; set; }
    public FixedModule FixedModule { get; set; }

    public int Order { get; set; } // optional: for ordering

    public WorkpieceTypeModule() { }

    public WorkpieceTypeModule(WorkpieceType type, FixedModule module, int order = 0)
    {
        WorkpieceType = type;
        WorkpieceTypeId = type.Id;
        FixedModule = module;
        FixedModuleId = module.SerialNumber;
        Order = order;
    }
}
