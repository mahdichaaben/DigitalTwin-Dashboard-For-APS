using backend_dash.Domain;

namespace backend_dash.Repositories;

public interface ISensorLogRepository
{
    Task<SensorLog?> GetLatestAsync(string sensorId);
    Task<List<SensorLog>> GetAsync(string sensorId, int? limit = null);
    Task AddAsync(SensorLog log);
}