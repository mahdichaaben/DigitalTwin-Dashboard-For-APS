using backend_dash.Domain;

namespace backend_dash.Repositories;

public interface IAlertRepository
{

    Task AddAsync(AlertEntity alert);
    Task UpdateAsync(AlertEntity alert);
    Task DeleteAsync(string alertId);

    Task<List<AlertEntity>> GetAllAsync();
    Task<AlertEntity?> GetByIdAsync(string alertId);

    Task<List<AlertEntity>> FilterAsync(
        string? sensorId = null,
        string? digitalModuleId = null,
        string? status = null
    );

    // ?? Advanced (optional but useful)
    Task<AlertEntity?> GetLastActiveAlertAsync(
        string? alertType,
        string? digitalModuleId,
        string? sensorId,
        string? startedAt = null
    );

    Task AddRangeAsync(List<AlertEntity> alerts);
    Task<bool> ExistsAsync(string alertId);
}
