// File: WebApi/Mappers/StoreMapper.cs
using backend_dash.Domain;
using backend_dash.WebApi.Dtos;
using System.Linq;

namespace backend_dash.WebApi.Mappers
{
    public static class StoreMapper
    {
        public static StoreDto ToDto(Store store) => new StoreDto
        {
            SerialNumber = store.SerialNumber,
            Name = store.Name,
            StorageModules = store.StorageModules
                                  .Select(ToDto)
                                  .ToList()
        };

        public static StorageModuleDto ToDto(StorageModule module) => new StorageModuleDto
        {
            SerialNumber = module.SerialNumber,
            Name = module.Name,
            Slots = module.Slots
                          .Select(ToDto)
                          .ToList()
        };

        public static StorageSlotDto ToDto(StorageSlot slot) => new StorageSlotDto
        {
            Id = slot.Id,
            SlotName = slot.SlotName,
            WorkpieceId = slot.Workpiece?.Id,
            WorkpieceState = slot.Workpiece?.State,
            WorkpieceTypeName = slot.Workpiece?.Type?.Name
        };
    }
}
