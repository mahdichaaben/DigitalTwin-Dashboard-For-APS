using backend_dash.Domain;
using backend_dash.Repositories;
using backend_dash.WebApi.Hubs;
using Microsoft.Extensions.DependencyInjection;

namespace backend_dash.Services;

public class AlertService : IAlertService
{
    private readonly IAlertRepository _alertRepository;
    private readonly RealTimeLogger _realTimeLogger;
                    
    public AlertService(IAlertRepository alertRepository, RealTimeLogger realTimeLogger)
    {
        _alertRepository = alertRepository;
        _realTimeLogger = realTimeLogger;
    }

    public async Task SaveAlerts(List<AlertEntity> alerts)
    {
        foreach (var alert in alerts)
        {
            Console.WriteLine("--------------------------------------------------");
            Console.WriteLine($"Alert ID: {alert.AlertId}");
            Console.WriteLine($"  Digital Module ID: {alert.DigitalModuleId}");
            Console.WriteLine($"  Sensor ID: {alert.SensorId ?? "N/A"}");
            Console.WriteLine($"  Alert Type: {alert.AlertType}");
            Console.WriteLine($"  Description: {alert.Description}");
            Console.WriteLine($"  Summary: {alert.Summary}");
            Console.WriteLine($"  Status: {alert.Status}");
            Console.WriteLine($"  Started At: {alert.StartedAt}");
            Console.WriteLine($"  Ended At: {alert.EndedAt}");
            Console.WriteLine("--------------------------------------------------");

            if (alert.DigitalModuleId == "[no value]")
                continue;

            var existingAlert = await _alertRepository.GetLastActiveAlertAsync(
                alert.AlertType,
                alert.DigitalModuleId,
                alert.SensorId,
                alert.StartedAt
            );

            if (alert.Status.Equals("resolved", StringComparison.OrdinalIgnoreCase))
            {
                if (existingAlert != null)
                {
                    existingAlert.Status = "resolved";
                    existingAlert.EndedAt = alert.StartedAt;
                    existingAlert.Summary = $"Issue resolved: {existingAlert.Summary}";

                    await _alertRepository.UpdateAsync(existingAlert);
                    await _realTimeLogger.NotifyAlertChanged(existingAlert); // Notify update
                    Console.WriteLine($"✅ Updated alert as resolved: {existingAlert.AlertId}");
                }
                else
                {
                    alert.Summary = $"Issue resolved: {alert.Summary}";
                    alert.EndedAt = DateTime.UtcNow.ToString("o");

                    await _alertRepository.AddAsync(alert);
                    await _realTimeLogger.NotifyAlertChanged(alert); // Notify new resolved alert
                    Console.WriteLine($"🆕 Inserted new resolved alert: {alert.AlertId}");
                }
            }
            else
            {
                await _alertRepository.AddAsync(alert);
                await _realTimeLogger.NotifyAlertChanged(alert); // Notify new active alert
                Console.WriteLine($"🟢 Added new active alert: {alert.AlertId}");
            }
        }
    }

    public async Task<List<AlertEntity>> GetAllAlertsAsync()
    {
        return await _alertRepository.GetAllAsync();
    }

    public async Task<AlertEntity?> GetAlertByIdAsync(string alertId)
    {
        return await _alertRepository.GetByIdAsync(alertId);
    }

    public async Task DeleteAlertAsync(string alertId)
    {
        await _alertRepository.DeleteAsync(alertId);
    }

    public async Task<List<AlertEntity>> FilterAlertsAsync(
        string? sensorId = null,
        string? digitalModuleId = null,
        string? status = null)
    {
        return await _alertRepository.FilterAsync(sensorId, digitalModuleId, status);
    }
}
