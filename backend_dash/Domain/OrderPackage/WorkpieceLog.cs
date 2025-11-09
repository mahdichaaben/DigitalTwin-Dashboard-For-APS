    using System;

    namespace backend_dash.Domain
    {
        public class WorkpieceLog
        {
            public int Id { get; set; }  

            public string WorkpieceId { get; set; } = default!;

            public string? WorkpieceType { get; set; }

            public string State { get; set; } = default!;

            public string? ModuleSerial { get; set; }

            public string? OrderId { get; set; }

            public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        }
    }
