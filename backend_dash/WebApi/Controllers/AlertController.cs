using backend_dash.Domain;
using backend_dash.Services;
using backend_dash.Services.Mappers;
using backend_dash.WebApi.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace backend_dash.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AlertController : ControllerBase
    {
        private readonly IAlertService _alertService;

        public AlertController(IAlertService alertService)
        {
            _alertService = alertService;
        }

        [HttpPost]
        public async Task<IActionResult> ReceiveAlerts([FromBody] GrafanaWebhook webhook) // ✅ Made async
        {
            if (webhook == null || webhook.Alerts == null || !webhook.Alerts.Any())
            {
                return BadRequest("No alerts received.");
            }

            try
            {
                // Map Grafana alerts to domain entities
                var alertEntities = webhook.Alerts.Select(GrafanaAlertMapper.ToDomain).ToList();

                // ✅ Properly await the service call
                await _alertService.SaveAlerts(alertEntities);

                return Ok(new { message = "Alerts processed successfully.", count = alertEntities.Count });
            }
            catch (Exception ex)
            {
                // Log the error (use your logging framework)
                Console.WriteLine($"Error processing alerts: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while processing alerts.", error = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAlerts()
        {
            try
            {
                var alerts = await _alertService.GetAllAlertsAsync();
                return Ok(alerts);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving alerts: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while retrieving alerts." });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAlertById(string id)
        {
            try
            {
                var alert = await _alertService.GetAlertByIdAsync(id);
                if (alert == null)
                {
                    return NotFound($"Alert with ID {id} not found.");
                }
                return Ok(alert);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving alert {id}: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while retrieving the alert." });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAlert(string id)
        {
            try
            {
                var alert = await _alertService.GetAlertByIdAsync(id);
                if (alert == null)
                {
                    return NotFound($"Alert with ID {id} not found.");
                }

                await _alertService.DeleteAlertAsync(id);
                return Ok(new { message = "Alert deleted successfully." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting alert {id}: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while deleting the alert." });
            }
        }

        [HttpGet("filter")]
        public async Task<IActionResult> FilterAlerts([FromQuery] string? sensorId = null, [FromQuery] string? digitalModuleId = null, [FromQuery] string? status = null)
        {
            try
            {
                var filteredAlerts = await _alertService.FilterAlertsAsync(sensorId, digitalModuleId, status);
                return Ok(filteredAlerts);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error filtering alerts: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while filtering alerts." });
            }
        }
    }
}