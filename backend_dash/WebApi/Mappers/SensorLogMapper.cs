using backend_dash.Domain;
using backend_dash.WebApi.Dtos;

namespace backend_dash.WebApi.Mappers;

public static class SensorLogMapper
{
    public static SensorLogDto ToDto(SensorLog log)
    {
        return new SensorLogDto
        {
            SensorId = log.SensorId,
            Timestamp = log.Timestamp,
            ValueRaw = log.ValueRaw,
            ValueNumeric = log.ValueNumeric
        };
    }
}
