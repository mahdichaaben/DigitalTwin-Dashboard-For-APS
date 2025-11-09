// File: WebApi/Dtos/FactoryDto.cs
using System.Collections.Generic;

namespace backend_dash.WebApi.Dtos;

public class FactoryDto
{
    public string Ref { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;

    public List<ModuleDto> Modules { get; set; } = new();
}
