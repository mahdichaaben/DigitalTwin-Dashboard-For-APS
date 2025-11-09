using backend_dash.Domain;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace backend_dash.WebApi.Hubs
{
    public class RealTimeLogger
    {
        private readonly IHubContext<FactoryHub> _hub;

        public RealTimeLogger(IHubContext<FactoryHub> hub)
        {
            _hub = hub;
        }

        public async Task NotifyModuleChanged(ModuleLog log)
        {
            try
            {
                var clientsInGroup = _hub.Clients.Group(log.ModuleSerialNumber);

                // Log connected clients
                if (FactoryHub.GetModuleGroupClients().TryGetValue(log.ModuleSerialNumber, out var connections))
                {
                    Console.WriteLine($"[RealTimeLogger] Clients in module group {log.ModuleSerialNumber}: {string.Join(", ", connections)}");
                }
                else
                {
                    Console.WriteLine($"[RealTimeLogger] No clients in module group {log.ModuleSerialNumber}");
                }

                // Send update
                await clientsInGroup.SendAsync("ModuleUpdated",log);

                Console.WriteLine($"[RealTimeLogger] Module update sent for {log.ModuleSerialNumber}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[RealTimeLogger] Error sending module log: {ex.Message}");
            }
        }

        /// <summary>
        /// Notify clients about a workpiece update based on the logged WorkpieceLog.
        /// </summary>
        public async Task NotifyWorkpieceChanged(WorkpieceLog log)
        {
            try
            {
                var clientsInGroup = _hub.Clients.Group(log.WorkpieceId);

                // Log connected clients
                if (FactoryHub.GetWorkpieceGroupClients().TryGetValue(log.WorkpieceId, out var connections))
                {
                    Console.WriteLine($"[RealTimeLogger] Clients in workpiece group {log.WorkpieceId}: {string.Join(", ", connections)}");
                }
                else
                {
                    Console.WriteLine($"[RealTimeLogger] No clients in workpiece group {log.WorkpieceId}");
                }

                // Send update to clients subscribed to this specific workpiece
                await clientsInGroup.SendAsync("WorkpieceUpdated", log);

                Console.WriteLine($"[RealTimeLogger] Workpiece update sent for {log.WorkpieceId}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[RealTimeLogger] Error sending workpiece log: {ex.Message}");
            }
        }

        public async Task NotifyAlertChanged(AlertEntity alert)
        {
            try
            {
                var clientsInGroup = _hub.Clients.Group(alert.SensorId);

                // Log connected clients
                if (!string.IsNullOrEmpty(alert.SensorId) &&
                    FactoryHub.GetAlertGroupClients().TryGetValue(alert.SensorId, out var connections))
                {
                    Console.WriteLine($"[RealTimeLogger] Clients in alert group {alert.SensorId}: {string.Join(", ", connections)}");
                }
                else
                {
                    Console.WriteLine($"[RealTimeLogger] No clients in alert group {alert.SensorId}");
                }

                // Send update to clients subscribed to this sensor's alert group
                await clientsInGroup.SendAsync("AlertUpdated", alert);

                Console.WriteLine($"[RealTimeLogger] Alert update sent for sensor {alert.SensorId}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[RealTimeLogger] Error sending alert: {ex.Message}");
            }
        }
    }
}