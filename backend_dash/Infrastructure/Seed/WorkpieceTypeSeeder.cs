using backend_dash.Domain;
using backend_dash.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace backend_dash.Infrastructure.Seed
{
    public class WorkpieceTypeSeeder
    {
        private readonly AppDbContext _context;

        public WorkpieceTypeSeeder(AppDbContext context)
        {
            _context = context;
        }


        public async Task SeedAsync()
        {
            var typeBlue = await _context.WorkpieceTypes.FirstOrDefaultAsync(t => t.Id == "BLUE1");
            if (typeBlue == null)
            {
                typeBlue = new WorkpieceType("BLUE1","BLUE", "BLUE");
                await _context.WorkpieceTypes.AddAsync(typeBlue);
            }

            var typeRed = await _context.WorkpieceTypes.FirstOrDefaultAsync(t => t.Id == "RED1");
            if (typeRed == null)
            {
                typeRed = new WorkpieceType("RED1", "RED", "RED");
                await _context.WorkpieceTypes.AddAsync(typeRed);
            }

            var typeWhite = await _context.WorkpieceTypes.FirstOrDefaultAsync(t => t.Id == "WHITE1");
            if (typeWhite == null)
            {
                typeWhite = new WorkpieceType("WHITE1", "WHITE", "WHITE");
                await _context.WorkpieceTypes.AddAsync(typeWhite);
            }

            await _context.SaveChangesAsync();


            


        }
    }

}
