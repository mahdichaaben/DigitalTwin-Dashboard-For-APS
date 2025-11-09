using backend_dash.Domain;
using backend_dash.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend_dash.Repositories;

public class SensorRepository : ISensorRepository
{
    private readonly AppDbContext _context;

    public SensorRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Sensor?> GetByIdAsync(string sensorId)
    {
        return await _context.Set<Sensor>()
            .Include(s => s.Logs) // eager load logs if needed
            .FirstOrDefaultAsync(s => s.SensorId == sensorId);
    }

    public async Task<List<Sensor>> GetAllAsync()
    {
        return await _context.Set<Sensor>()
            .Include(s => s.Logs)
            .ToListAsync();
    }

    public async Task AddAsync(Sensor sensor)
    {
        await _context.Set<Sensor>().AddAsync(sensor);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Sensor sensor)
    {
        _context.Set<Sensor>().Update(sensor);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(string sensorId)
    {
        var sensor = await GetByIdAsync(sensorId);
        if (sensor != null)
        {
            _context.Set<Sensor>().Remove(sensor);
            await _context.SaveChangesAsync();
        }
    }
}
