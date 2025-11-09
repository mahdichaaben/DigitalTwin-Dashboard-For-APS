using backend_dash.Domain;
using backend_dash.WebApi.Dtos;
using System.Reflection;

namespace backend_dash.WebApi.Mappers;

public static class FactoryMapper
{

    public static FactoryDto ToDto(DigitalFactory factory) => new FactoryDto
    {
        Ref = factory.Ref,
        Name = factory.Name,
        Modules = factory.DigitalModules.Select(ToDto).ToList()
    };

    public static ModuleDto ToDto(DigitalModule module) => new ModuleDto
    {
        SerialNumber = module.SerialNumber,
        Name = module.Name,
        State = module.ComponentState,
        Status = module.Status,
        ModuleType = module switch
        {
            TransportModule => "TransportModule",
            StorageModule => "StorageModule",
            FixedModule => "FixedModule",
            _ => "DigitalModule"
        },
        CurrentWorkpiecesCount = module.CurrentWorkpieces.Count,
        CurrentWorkpieceIds = module.CurrentWorkpieces.Select(wp => wp.Id).ToList(),
        CurrentPosition = module is TransportModule transport ? transport.CurrentPosition : null,
        CurrentCommand = module.CurrentAction?.CommandName,
        CurrentStatus = module.Status
    };



    public static List<FactoryDto> ToDtoList(IEnumerable<DigitalFactory> factories) =>
        factories.Select(ToDto).ToList();

    public static List<ModuleDto> ToModuleDtoList(IEnumerable<DigitalModule> modules) =>
        modules.Select(ToDto).ToList();
}
