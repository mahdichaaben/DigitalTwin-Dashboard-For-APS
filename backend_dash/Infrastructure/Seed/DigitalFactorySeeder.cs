using backend_dash.Domain;
using backend_dash.Infrastructure.Data;

namespace backend_dash.Infrastructure.Seed
{
    public class DigitalFactorySeeder
    {
        private readonly AppDbContext _context;
        private readonly DigitalFactory _factory;

        public DigitalFactorySeeder(AppDbContext context, DigitalFactory factory)
        {
            _context = context;
            _factory = factory;
        }

        public void Seed()
        {
            if (_context.DigitalFactories.Any())
                return;

            _context.DigitalFactories.Add(_factory);
            _context.SaveChanges();
        }
    }
}
