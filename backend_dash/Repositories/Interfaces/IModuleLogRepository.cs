using backend_dash.Domain;
using System.Threading.Tasks;

namespace backend_dash.Repositories;

    public interface IModuleLogRepository
    {
        Task AddAsync(ModuleLog log);

    Task<IEnumerable<ModuleLog>> GetAsync(string? moduleSerial = null, string? status = null);

}
