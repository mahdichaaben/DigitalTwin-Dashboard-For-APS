using backend_dash.Domain;

namespace backend_dash.Services
{
    public interface ISensorService
    {
        Task<Sensor?> GetSensorByIdAsync(string sensorId);
        Task<List<Sensor>> GetAllSensorsAsync();
        Task<Sensor> CreateSensorAsync(Sensor sensor);
        Task<Sensor?> UpdateSensorAsync(Sensor sensor);
        Task<bool> DeleteSensorAsync(string sensorId);
    }
}