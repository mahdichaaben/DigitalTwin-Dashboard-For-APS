using backend_dash.Domain;

public class StorageSlot
{
    public int Id { get; set; }
    public string SlotName { get; set; } = string.Empty;

    public Workpiece? Workpiece { get; set; }

    // Match the type of the primary key
    public string StorageModuleId { get; set; }
    public StorageModule StorageModule { get; set; } = null!;
}
