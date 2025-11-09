using backend_dash.Domain;
using backend_dash.Infrastructure.Data;
using backend_dash.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend_dash.Repositories;
    public class ModuleLogRepository : IModuleLogRepository
    {
        private readonly AppDbContext _context;

        public ModuleLogRepository(AppDbContext context)
        {
            _context = context;
        }


        public async Task AddAsync(ModuleLog log)
        {
            _context.ModuleLogs.Add(log);
            await _context.SaveChangesAsync();
        }


        public async Task<IEnumerable<ModuleLog>> GetAsync(string? moduleSerial = null, string? status = null)
        {
            IQueryable<ModuleLog> query = _context.ModuleLogs.AsQueryable();

            if (!string.IsNullOrEmpty(moduleSerial))
                query = query.Where(l => l.ModuleSerialNumber == moduleSerial);

            if (!string.IsNullOrEmpty(status))
                query = query.Where(l => l.Status == status);

            return await query
                .OrderByDescending(l => l.Timestamp)
                .ToListAsync();
        }
    }
