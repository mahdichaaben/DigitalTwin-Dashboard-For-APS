// File: WebApi/Mappers/WorkpieceMapper.cs
using backend_dash.Domain;
using backend_dash.WebApi.Dtos;

namespace backend_dash.WebApi.Mappers
{
    public static class WorkpieceMapper
    {
        public static WorkpieceDto ToDto(Workpiece wp) => new()
        {
            Id = wp.Id,
            TypeName=wp.Type.Name,
            State = wp.State,
        };

        public static WorkpieceTypeDto ToDto(WorkpieceType type) => new()
        {
            Id = type.Id,
            Name = type.Name,
            Color = type.Color,
            ModuleNames = type.ModuleLinks
                              .OrderBy(link => link.Order)        // keep modules in defined order
                              .Select(link => link.FixedModule?.Name ?? string.Empty)
                              .ToList()
        };

        public static List<WorkpieceDto> ToDtoList(IEnumerable<Workpiece> wps) =>
            wps.Select(ToDto).ToList();

        public static List<WorkpieceTypeDto> ToTypeDtoList(IEnumerable<WorkpieceType> types) =>
            types.Select(ToDto).ToList();
    }
}
