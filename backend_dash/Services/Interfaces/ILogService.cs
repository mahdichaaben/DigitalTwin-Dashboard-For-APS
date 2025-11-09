using backend_dash.Domain;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace backend_dash.Services;

public interface ILogService
{
    Task AddWorkpieceLogAsync(WorkpieceLog log);
    Task AddModuleLogAsync(ModuleLog log);

    Task<IEnumerable<WorkpieceLog>> GetWorkpieceLogsAsync(string? workpieceId = null, string? state = null,string? orderId=null);
    Task<IEnumerable<ModuleLog>> GetModuleLogsAsync(string? moduleSerial = null, string? status = null);
}
