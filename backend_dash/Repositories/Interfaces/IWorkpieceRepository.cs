namespace backend_dash.Repositories;

using backend_dash.Domain;

public interface IWorkpieceRepository
{


    Task<WorkpieceType?> GetTypeByIdAsync(string id);


    Task<Workpiece?> GetWorkpieceByIdAsync(string id);
    Task<List<Workpiece>> GetByIdsAsync(List<string> ids);
    Task AddAsync(Workpiece workpiece);

    Task<List<WorkpieceType>> GetAllTypesAsync();
    Task<List<Workpiece>> GetByStateAsync(string state);

    Task<List<Workpiece>> GetAllAsync();


    Task<WorkpieceType> ConfigureWorkpieceTypeAsync(string typeId, List<string> moduleIds);


    Task UpdateAsync(Workpiece workpiece);


    Task UpdateStateAsync(string workpieceId, string newState);
    Task SaveChangesAsync();
}