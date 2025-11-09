using System;

namespace backend_dash.Domain
{
    public class ModuleLog
    {
        public int Id { get; set; }

        // The serial number of the module
        public string ModuleSerialNumber { get; set; } = default!;

        // Optional human-readable name of the module
        public string? ModuleName { get; set; }

        public string? ModuleState { get; set; }
        public string? CommandName {  get; set; }

        public string? wpId { get; set; }
        public string? Status { get; set; } 

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
