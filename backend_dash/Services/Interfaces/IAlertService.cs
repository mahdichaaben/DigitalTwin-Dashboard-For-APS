using backend_dash.Domain;
using System.Collections.Generic;

namespace backend_dash.Services
{
    public interface IAlertService
    {
        Task SaveAlerts(List<AlertEntity> alerts);
        Task<List<AlertEntity>> GetAllAlertsAsync();
        Task<AlertEntity?> GetAlertByIdAsync(string alertId);
        Task<List<AlertEntity>> FilterAlertsAsync(string? sensorId = null, string? digitalModuleId = null, string? status = null);
        Task DeleteAlertAsync(string alertId);
    }
}
