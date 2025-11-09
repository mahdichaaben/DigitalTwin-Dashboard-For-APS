using backend_dash.Domain;
using backend_dash.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend_dash.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LogController : ControllerBase
    {
        private readonly ILogService _logService;

        public LogController(ILogService logService)
        {
            _logService = logService;
        }

        [HttpGet("workpieces")]
        public async Task<ActionResult<IEnumerable<WorkpieceLog>>> GetWorkpieceLogs(
            [FromQuery] string? workpieceId = null,
            [FromQuery] string? state = null,
            [FromQuery] string? orderId = null
            )
        {
            var logs = await _logService.GetWorkpieceLogsAsync(workpieceId, state,orderId);
            return Ok(logs);
        }


        [HttpGet("modules")]
        public async Task<ActionResult<IEnumerable<ModuleLog>>> GetModuleLogs(
            [FromQuery] string? moduleSerial = null,
            [FromQuery] string? status = null)
        {
            var logs = await _logService.GetModuleLogsAsync(moduleSerial, status);
            return Ok(logs);
        }
    }
}
