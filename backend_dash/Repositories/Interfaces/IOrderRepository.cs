// File: Repositories/Interfaces/IOrderRepository.cs
namespace backend_dash.Repositories;

using backend_dash.Domain;

public interface IOrderRepository
{
    Task<Order?> GetByIdAsync(string id);
    Task<List<Order>> GetAllAsync();
    Task AddAsync(Order order);
    Task SaveChangesAsync();



    Task UpdateAsync(Order order);



}
