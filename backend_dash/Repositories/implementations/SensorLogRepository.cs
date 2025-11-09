using backend_dash.Domain;
using backend_dash.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend_dash.Repositories;

public class SensorLogRepository : ISensorLogRepository
{
    private readonly AppDbContext _context;

    public SensorLogRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<SensorLog?> GetLatestAsync(string sensorId)
    {
        return await _context.SensorLogs
            .Where(sl => sl.SensorId == sensorId)
            .OrderByDescending(sl => sl.Timestamp)
            .FirstOrDefaultAsync();
    }

    public async Task<List<SensorLog>> GetAsync(string sensorId, int? limit = null)
    {
        IQueryable<SensorLog> query = _context.SensorLogs
            .Where(sl => sl.SensorId == sensorId)
            .OrderByDescending(sl => sl.Timestamp);

        if (limit.HasValue)
            query = query.Take(limit.Value);

        return await query.ToListAsync();
    }

    public async Task AddAsync(SensorLog log)
    {
        await _context.SensorLogs.AddAsync(log);
        await _context.SaveChangesAsync();
    }
}
