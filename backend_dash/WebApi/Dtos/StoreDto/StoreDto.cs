using System;
using System.Collections.Generic;

namespace backend_dash.WebApi.Dtos
{
    public class StoreDto
    {
        public string SerialNumber { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;

        public List<StorageModuleDto> StorageModules { get; set; } = new();
    }

    public class StorageModuleDto
    {
        public string SerialNumber { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;

        public List<StorageSlotDto> Slots { get; set; } = new();
    }

    public class StorageSlotDto
    {
        public int Id { get; set; }
        public string SlotName { get; set; } = string.Empty;

        public string? WorkpieceId { get; set; }
        public string? WorkpieceState { get; set; }
        public string? WorkpieceTypeName { get; set; }
    }
}
