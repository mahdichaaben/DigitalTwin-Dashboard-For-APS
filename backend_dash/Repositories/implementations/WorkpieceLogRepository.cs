using backend_dash.Domain;
using backend_dash.Infrastructure.Data;
using backend_dash.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace backend_dash.Repositories;
    public class WorkpieceLogRepository : IWorkpieceLogRepository
    {
        private readonly AppDbContext _context;

        public WorkpieceLogRepository(AppDbContext context)
        {
            _context = context;
        }

    public async Task AddAsync(WorkpieceLog log)
    {
        // If OrderId is set, ensure the order actually exists in the database
        if (log.OrderId != null)
        {
            var orderExists = await _context.Orders.AsNoTracking()
                                                   .AnyAsync(o => o.Id == log.OrderId);
            if (!orderExists)
            {
                // Optional: log that the workpiece log is skipped due to missing Order
                Console.WriteLine($"Skipping WorkpieceLog for Workpiece {log.WorkpieceId} because Order {log.OrderId} does not exist.");

                // Avoid FK violation
                log.OrderId = null;
            }
        }

        // Add and save the log
        await _context.WorkpieceLogs.AddAsync(log);
        await _context.SaveChangesAsync();
    }





    public async Task<IEnumerable<WorkpieceLog>> GetAsync(string? workpieceId = null, string? state = null, string? orderId = null)
    {
        var query = _context.WorkpieceLogs.AsQueryable();

        if (!string.IsNullOrEmpty(workpieceId))
            query = query.Where(l => l.WorkpieceId == workpieceId);

        if (!string.IsNullOrEmpty(state))
            query = query.Where(l => l.State == state);

        if (!string.IsNullOrEmpty(orderId))
            query = query.Where(l => l.OrderId == orderId);

        return await query.OrderByDescending(l => l.Timestamp).ToListAsync();
    }


}
