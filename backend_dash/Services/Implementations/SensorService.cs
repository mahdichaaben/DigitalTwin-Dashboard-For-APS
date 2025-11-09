using backend_dash.Domain;
using backend_dash.Repositories;

namespace backend_dash.Services;
    public class SensorService : ISensorService
    {
        private readonly ISensorRepository _sensorRepository;

        public SensorService(ISensorRepository sensorRepository)
        {
            _sensorRepository = sensorRepository;
        }

        public async Task<Sensor?> GetSensorByIdAsync(string sensorId)
        {
            return await _sensorRepository.GetByIdAsync(sensorId);
        }

        public async Task<List<Sensor>> GetAllSensorsAsync()
        {
            return await _sensorRepository.GetAllAsync();
        }

        public async Task<Sensor> CreateSensorAsync(Sensor sensor)
        {
            sensor.LastUpdate = DateTime.UtcNow;
            sensor.IsActive = true;

            await _sensorRepository.AddAsync(sensor);
            return sensor;
        }

        public async Task<Sensor?> UpdateSensorAsync(Sensor sensor)
        {
            var existing = await _sensorRepository.GetByIdAsync(sensor.SensorId);
            if (existing == null)
                return null;

            existing.Name = sensor.Name;
            existing.Description = sensor.Description;
            existing.SensorType = sensor.SensorType;
            existing.Unit = sensor.Unit;
            existing.MinValue = sensor.MinValue;
            existing.MaxValue = sensor.MaxValue;
            existing.IsActive = sensor.IsActive;
            existing.LastUpdate = DateTime.UtcNow;

            await _sensorRepository.UpdateAsync(existing);
            return existing;
        }

        public async Task<bool> DeleteSensorAsync(string sensorId)
        {
            var existing = await _sensorRepository.GetByIdAsync(sensorId);
            if (existing == null)
                return false;

            await _sensorRepository.DeleteAsync(sensorId);
            return true;
        }
    }
