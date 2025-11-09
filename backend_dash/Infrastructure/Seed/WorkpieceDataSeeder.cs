using backend_dash.Domain.Events;
using backend_dash.Infrastructure.Data;

namespace backend_dash.Infrastructure.Seed
{
    public class WorkpieceDataSeeder
    {
        private readonly AppDbContext _context;
        private readonly WorkpieceEventHandler _eventHandler;

        public WorkpieceDataSeeder(AppDbContext context , WorkpieceEventHandler wpevent)
        {
            _context = context;
            _eventHandler= wpevent;
        }

        public async Task SeedAllAsync()
        {
            // Seed WorkpieceTypes first
            var typeSeeder = new WorkpieceTypeSeeder(_context);
            await typeSeeder.SeedAsync();

            // Then seed Workpieces
            var workpieceSeeder = new WorkpieceSeeder(_context, _eventHandler);
            await workpieceSeeder.SeedAsync();
        }
    }
}
