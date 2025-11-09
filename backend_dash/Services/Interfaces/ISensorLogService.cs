using backend_dash.Domain;

namespace backend_dash.Services;



    public interface ISensorLogService
    {

        Task<SensorLog?> GetLatestLogAsync(string sensorId);
        Task<List<SensorLog>> GetLogsAsync(string sensorId, int? limit = null);
    }
