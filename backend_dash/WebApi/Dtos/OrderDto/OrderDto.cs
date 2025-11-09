using System;
using System.Collections.Generic;

namespace backend_dash.WebApi.Dtos
{
    public class OrderDto
    {
        public string Id { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? RequestedBy { get; set; }
        public DateTime CreatedAt { get; set; }

       // public List<WorkpieceDto> Workpieces { get; set; } = new();

        public string OrderType { get; set; } = string.Empty;
    }




    public class WorkpieceDto
    {
        public string Id { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;

        public string TypeName { get; set; } = string.Empty;
        public string AddedBy { get; set; } = string.Empty;
    }

    public class WorkpieceTypeDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public List<string> ModuleNames { get; set; } = new();
    }

    public class CommandDto
    {
        public string Name { get; set; } = string.Empty;
    }
}
