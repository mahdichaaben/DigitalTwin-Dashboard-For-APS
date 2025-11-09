using backend_dash.Domain;
using backend_dash.Services;
using backend_dash.WebApi.Dtos;
using backend_dash.WebApi.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace backend_dash.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SensorLogController : ControllerBase
    {
        private readonly ISensorLogService _sensorLogService;

        public SensorLogController(ISensorLogService sensorLogService)
        {
            _sensorLogService = sensorLogService;
        }

        [HttpGet("{sensorId}/latest")]
        public async Task<ActionResult<SensorLogDto>> GetLatestLog(string sensorId)
        {
            var log = await _sensorLogService.GetLatestLogAsync(sensorId);
            if (log == null) return NotFound();
            return Ok(SensorLogMapper.ToDto(log));
        }

        [HttpGet("{sensorId}")]
        public async Task<ActionResult<List<SensorLogDto>>> GetLogs(string sensorId, [FromQuery] int? limit = null)
        {
            var logs = await _sensorLogService.GetLogsAsync(sensorId, limit);
            return Ok(logs.Select(SensorLogMapper.ToDto).ToList());
        }


    }
}