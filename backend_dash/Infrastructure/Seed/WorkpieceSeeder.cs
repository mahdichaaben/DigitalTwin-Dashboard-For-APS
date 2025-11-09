using backend_dash.Domain;
using backend_dash.Domain.Events;
using backend_dash.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend_dash.Infrastructure.Seed
{
    public class WorkpieceSeeder
    {
        private readonly AppDbContext _context;
        private readonly WorkpieceEventHandler _eventHandler;

        public WorkpieceSeeder(AppDbContext context, WorkpieceEventHandler wpevent)
        {
            _context = context;
            _eventHandler = wpevent;
        }

        public async Task SeedAsync()
        {
            // Ensure WorkpieceTypes are loaded
            var workpieceTypes = await _context.WorkpieceTypes.ToListAsync();

            if (!workpieceTypes.Any())
            {
                throw new InvalidOperationException("WorkpieceTypes must be seeded before Workpieces");
            }

            var workpiecesToAdd = new List<Workpiece>();

            foreach (var type in workpieceTypes)
            {
                for (int i = 1; i <= 1; i++) // 1 workpiece per type (adjust as needed)
                {
                    var workpieceId = $"{type.Id}_WP_{i:D3}";

                    // ✅ Check if this Workpiece already exists
                    bool exists = await _context.Workpieces.AnyAsync(w => w.Id == workpieceId);
                    if (exists) continue;

                    var workpiece = new Workpiece(workpieceId, type, "FREE");
                    workpiecesToAdd.Add(workpiece);

                    _eventHandler.Subscribe(workpiece);
                }
            }

            if (workpiecesToAdd.Any())
            {
                await _context.Workpieces.AddRangeAsync(workpiecesToAdd);
                await _context.SaveChangesAsync();

                Console.WriteLine($"✅ Seeded {workpiecesToAdd.Count} new Workpieces across {workpieceTypes.Count} types");
            }
            else
            {
                Console.WriteLine("ℹ️ No new Workpieces to seed (all already exist).");
            }
        }
    }
}
