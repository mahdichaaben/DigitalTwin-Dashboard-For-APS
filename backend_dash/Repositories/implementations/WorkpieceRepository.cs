// backend_dash/Repositories/Implementations/WorkpieceRepository.cs
namespace backend_dash.Repositories;
using backend_dash.Domain;
using backend_dash.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

public class WorkpieceRepository : IWorkpieceRepository
{
    private readonly AppDbContext _db;
    private readonly DigitalFactory _factory;

    public WorkpieceRepository(AppDbContext context, DigitalFactory factory)
    {
        _db = context;
        _factory = factory;
    }

    // Get all workpieces with their type and ordered modules
    public async Task<List<Workpiece>> GetAllAsync() =>
            await _db.Workpieces
                .Include(w => w.Type)
                    .ThenInclude(t => t.ModuleLinks)
                        .ThenInclude(l => l.FixedModule)
                            .ThenInclude(fm => fm.Proces)
                .ToListAsync();

    public async Task<Workpiece?> GetWorkpieceByIdAsync(string id) =>
        await _db.Workpieces
            .Include(w => w.Type)
                .ThenInclude(t => t.ModuleLinks)
                    .ThenInclude(l => l.FixedModule)
                        .ThenInclude(fm => fm.Proces)
            .FirstOrDefaultAsync(w => w.Id == id);

    public async Task<List<Workpiece>> GetByIdsAsync(List<string> ids) =>
        await _db.Workpieces
            .Include(w => w.Type)
                .ThenInclude(t => t.ModuleLinks)
                    .ThenInclude(l => l.FixedModule)
                        .ThenInclude(fm => fm.Proces)
            .Where(w => ids.Contains(w.Id))
            .ToListAsync();

    public async Task<List<Workpiece>> GetByStateAsync(string state) =>
        await _db.Workpieces
            .Include(w => w.Type)
                .ThenInclude(t => t.ModuleLinks)
                    .ThenInclude(l => l.FixedModule)
                        .ThenInclude(fm => fm.Proces)
            .Where(w => w.State == state)
            .ToListAsync();

    public async Task AddAsync(Workpiece workpiece) =>
        await _db.Workpieces.AddAsync(workpiece);

    public async Task UpdateAsync(Workpiece workpiece)
    {
        var existing = await _db.Workpieces.FirstOrDefaultAsync(w => w.Id == workpiece.Id);
        if (existing == null) return; 

        existing.State = workpiece.State;
        existing.LastProcessedModule = workpiece.LastProcessedModule;
        existing.Order = workpiece.Order;

        await _db.SaveChangesAsync();
    }


    public async Task SaveChangesAsync() =>
        await _db.SaveChangesAsync();

    public async Task<List<WorkpieceType>> GetAllTypesAsync() =>
        await _db.WorkpieceTypes
            .Include(t => t.ModuleLinks)
                .ThenInclude(link => link.FixedModule)
                    .ThenInclude(fm => fm.Proces)
            .ToListAsync();

    public async Task<WorkpieceType?> GetTypeByIdAsync(string id) =>
        await _db.WorkpieceTypes
            .Include(t => t.ModuleLinks)
                .ThenInclude(link => link.FixedModule)
                    .ThenInclude(fm => fm.Proces)
            .FirstOrDefaultAsync(t => t.Id == id);

    // Configure compatible modules for a workpiece type
    public async Task<WorkpieceType> ConfigureWorkpieceTypeAsync(string typeId, List<string> moduleIds)
    {
        var wpType = await _db.WorkpieceTypes
            .Include(t => t.ModuleLinks)
                .ThenInclude(link => link.FixedModule)
            .FirstOrDefaultAsync(t => t.Id == typeId);

        if (wpType == null)
            throw new InvalidOperationException($"WorkpieceType {typeId} not found.");

        // Remove old links
        _db.WorkpieceTypeModules.RemoveRange(wpType.ModuleLinks);

        await _db.SaveChangesAsync();


        // Add new links using domain method to handle bidirectional relation
        int order = 0;
        foreach (var moduleId in moduleIds)
        {
            var module = await _db.FixedModules.FirstOrDefaultAsync(m => m.SerialNumber == moduleId);
            if (module != null)
                wpType.AddCompatibleModule(module, order++);
        }

        await _db.SaveChangesAsync();

        return wpType;
    }


    public async Task UpdateStateAsync(string workpieceId, string newState)
    {
        var wp = await _db.Workpieces.FirstOrDefaultAsync(w => w.Id == workpieceId);
        if (wp == null)
        {
            Console.WriteLine($"[WorkpieceRepository] Workpiece {workpieceId} not found.");
            throw new InvalidOperationException($"Workpiece {workpieceId} not found.");
        }

        Console.WriteLine($"[WorkpieceRepository] Updating Workpiece {workpieceId} state from '{wp.State}' to '{newState}'");

        wp.State = newState;

        var rowsAffected = await _db.SaveChangesAsync();
        Console.WriteLine($"[WorkpieceRepository] Workpiece {workpieceId} state updated. Rows affected: {rowsAffected}");
    }



}
