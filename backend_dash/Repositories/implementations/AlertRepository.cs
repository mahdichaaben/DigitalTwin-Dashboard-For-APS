using backend_dash.Domain;
using backend_dash.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend_dash.Repositories;

public class AlertRepository : IAlertRepository
{
    private readonly AppDbContext _context;

    public AlertRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(AlertEntity alert)
    {
        try
        {
            await _context.Alerts.AddAsync(alert);
            await _context.SaveChangesAsync();
            Console.WriteLine($"? Successfully saved alert: {alert.AlertId}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"? Database error for alert {alert.AlertId}:");
            Console.WriteLine($"   Error Type: {ex.GetType().Name}");
            Console.WriteLine($"   Error Message: {ex.Message}");
            if (ex.InnerException != null)
                Console.WriteLine($"   Inner Exception: {ex.InnerException.Message}");
            Console.WriteLine($"   Stack Trace: {ex.StackTrace}");
            throw; // keep error propagation
        }
    }

    public async Task<List<AlertEntity>> GetAllAsync()
    {
        return await _context.Alerts
            .OrderByDescending(a => a.StartedAt)
            .ToListAsync();
    }

    public async Task<AlertEntity?> GetByIdAsync(string alertId)
    {
        return await _context.Alerts.FindAsync(alertId);
    }

    public async Task<List<AlertEntity>> FilterAsync(
        string? sensorId = null,
        string? digitalModuleId = null,
        string? status = null)
    {
        var query = _context.Alerts.AsQueryable();

        if (!string.IsNullOrEmpty(sensorId))
            query = query.Where(a => a.SensorId == sensorId);

        if (!string.IsNullOrEmpty(digitalModuleId))
            query = query.Where(a => a.DigitalModuleId == digitalModuleId);

        if (!string.IsNullOrEmpty(status))
            query = query.Where(a => a.Status == status);

        return await query
            .OrderByDescending(a => a.StartedAt)
            .ToListAsync();
    }

    public async Task UpdateAsync(AlertEntity alert)
    {
        _context.Alerts.Update(alert);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(string alertId)
    {
        var alert = await GetByIdAsync(alertId);
        if (alert != null)
        {
            _context.Alerts.Remove(alert);
            await _context.SaveChangesAsync();
        }
    }

    // Optional: Bulk insert
    public async Task AddRangeAsync(List<AlertEntity> alerts)
    {
        await _context.Alerts.AddRangeAsync(alerts);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> ExistsAsync(string alertId)
    {
        return await _context.Alerts.AnyAsync(a => a.AlertId == alertId);
    }

    /// <summary>
    /// Returns the latest active (non-resolved) alert matching the given type, module, and sensor.
    /// Optionally filters by StartedAt if provided.
    /// </summary>
    public async Task<AlertEntity?> GetLastActiveAlertAsync(
        string? alertType,
        string? digitalModuleId,
        string? sensorId,
        string? startedAt = null)
    {
        var query = _context.Alerts.AsQueryable();

        query = query.Where(a =>
            a.AlertType == alertType &&
            a.DigitalModuleId == digitalModuleId &&
            a.SensorId == sensorId &&
            a.Status != "resolved"
        );

        if (!string.IsNullOrEmpty(startedAt))
            query = query.Where(a => a.StartedAt == startedAt);

        return await query
            .OrderByDescending(a => a.StartedAt)
            .FirstOrDefaultAsync();
    }
}
