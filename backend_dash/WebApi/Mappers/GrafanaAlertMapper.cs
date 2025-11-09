using backend_dash.Domain;
using backend_dash.WebApi.Dtos;
using System;

namespace backend_dash.Services.Mappers
{
    public static class GrafanaAlertMapper
    {
        public static AlertEntity ToDomain(GrafanaAlert alert)
        {
            return new AlertEntity
            {
                AlertId = Guid.NewGuid().ToString(),
                Status = alert.Status,
                DigitalModuleId = alert.Labels.GetValueOrDefault("DigitalModuleId"),
                SensorId = alert.Labels.GetValueOrDefault("SensorId"),
                AlertType = alert.Labels.GetValueOrDefault("AlertType") ?? alert.Labels.GetValueOrDefault("alertname"),
                Description = alert.Annotations.GetValueOrDefault("description"),
                Summary = alert.Annotations.GetValueOrDefault("summary"),
                StartedAt = alert.StartsAt, // Use string directly
                EndedAt = alert.Status.Equals("resolved", StringComparison.OrdinalIgnoreCase)
                    ? alert.EndsAt
                    : null,
            };
        }
    }
}
