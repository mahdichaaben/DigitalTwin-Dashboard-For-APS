using backend_dash.Domain;
using backend_dash.Services;
using backend_dash.WebApi.Dtos;
using backend_dash.WebApi.Mappers;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend_dash.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SensorsController : ControllerBase
    {
        private readonly ISensorService _sensorService;
        private readonly ISensorLogService _sensorLogService;

        public SensorsController(ISensorService sensorService, ISensorLogService sensorLogService)
        {
            _sensorService = sensorService;
            _sensorLogService = sensorLogService;
        }

        [HttpGet]
        public async Task<ActionResult<List<SensorDto>>> GetAll()
        {
            var sensors = await _sensorService.GetAllSensorsAsync();
            var dtos = sensors.Select(SensorMapper.ToDto).ToList();
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SensorDto>> GetById(string id)
        {
            var sensor = await _sensorService.GetSensorByIdAsync(id);
            if (sensor == null) return NotFound();
            return Ok(SensorMapper.ToDto(sensor));
        }

        [HttpPost]
        public async Task<ActionResult<SensorDto>> Create([FromBody] SensorCreateRequest request)
        {
            var sensor = new Sensor
            {
                SensorId = request.SensorId,
                Name = request.Name,
                SensorType = request.SensorType,
                Description = request.Description,
                Unit = request.Unit,
                MinValue = request.MinValue,
                MaxValue = request.MaxValue,
                LastUpdate = request.LastUpdate,
                IsActive = request.IsActive,
                Logs = new List<SensorLog>()
            };
            var created = await _sensorService.CreateSensorAsync(sensor);
            return CreatedAtAction(nameof(GetById), new { id = created.SensorId }, SensorMapper.ToDto(created));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<SensorDto>> Update(string id, [FromBody] SensorUpdateRequest request)
        {
            if (id != request.SensorId) return BadRequest("Sensor ID mismatch");

            var sensor = new Sensor
            {
                SensorId = request.SensorId,
                Name = request.Name,
                SensorType = request.SensorType,
                Description = request.Description,
                Unit = request.Unit,
                MinValue = request.MinValue,
                MaxValue = request.MaxValue,
                LastUpdate = request.LastUpdate,
                IsActive = request.IsActive,
                Logs = new List<SensorLog>()
            };
            var updated = await _sensorService.UpdateSensorAsync(sensor);
            if (updated == null) return NotFound();

            return Ok(SensorMapper.ToDto(updated));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var deleted = await _sensorService.DeleteSensorAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        // Local record for create request
        public record SensorCreateRequest(
            string SensorId,
            string Name,
            string SensorType,
            string Description,
            string Unit,
            double? MinValue,
            double? MaxValue,
            DateTime LastUpdate,
            bool IsActive
        );

        // Local record for update request
        public record SensorUpdateRequest(
            string SensorId,
            string Name,
            string SensorType,
            string Description,
            string Unit,
            double? MinValue,
            double? MaxValue,
            DateTime LastUpdate,
            bool IsActive
        );
    }
}                           
