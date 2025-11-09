using backend_dash.Domain;
using backend_dash.Repositories;

namespace backend_dash.Services;

public class SensorLogService : ISensorLogService
{
    private readonly ISensorLogRepository _logRepository;

    public SensorLogService(ISensorLogRepository logRepository)
    {
        _logRepository = logRepository;
    }

    public async Task<SensorLog?> GetLatestLogAsync(string sensorId)
    {
        return await _logRepository.GetLatestAsync(sensorId);
    }

    public async Task<List<SensorLog>> GetLogsAsync(string sensorId, int? limit = null)
    {
        return await _logRepository.GetAsync(sensorId, limit);
    }
}
