using backend_dash.Domain;
using backend_dash.WebApi.Dtos;
using backend_dash.WebApi.Mappers;
using System.Collections.Generic;
using System.Linq;

namespace backend_dash.WebApi.Mappers
{
    public static class SensorMapper
    {
        public static SensorDto ToDto(Sensor sensor)
        {
            return new SensorDto
            {
                SensorId = sensor.SensorId,
                Name = sensor.Name,
                SensorType = sensor.SensorType,
                Description = sensor.Description,
                Unit = sensor.Unit,
                MinValue = sensor.MinValue,
                MaxValue = sensor.MaxValue,
                LastUpdate = sensor.LastUpdate,
                IsActive = sensor.IsActive,
            };
        }
    }
}

