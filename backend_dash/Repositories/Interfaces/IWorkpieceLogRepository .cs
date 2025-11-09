using backend_dash.Domain;

namespace backend_dash.Repositories;

public interface IWorkpieceLogRepository
{
    Task AddAsync(WorkpieceLog log);


    Task<IEnumerable<WorkpieceLog>> GetAsync(string? workpieceId = null, string? state = null,string? orderId=null);

}
