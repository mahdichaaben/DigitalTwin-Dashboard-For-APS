using backend_dash.Domain;

namespace backend_dash.Repositories;

public interface ISensorRepository
{
    Task<Sensor?> GetByIdAsync(string sensorId);
    Task<List<Sensor>> GetAllAsync();
    Task AddAsync(Sensor sensor);
    Task UpdateAsync(Sensor sensor);
    Task DeleteAsync(string sensorId);
}
