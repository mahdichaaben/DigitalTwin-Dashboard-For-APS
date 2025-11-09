namespace backend_dash.Repositories;

using backend_dash.Domain;
using backend_dash.Repositories;
using Microsoft.EntityFrameworkCore;
using backend_dash.Infrastructure.Data;

public class OrderRepository : IOrderRepository
{
    private readonly AppDbContext _db;

    public OrderRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Order?> GetByIdAsync(string id) =>
        await _db.Orders
            .Include(o => o.Workpieces)
            .ThenInclude(wp => wp.Type)
            .FirstOrDefaultAsync(o => o.Id == id);

    public async Task<List<Order>> GetAllAsync() =>
        await _db.Orders
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();


    public async Task AddAsync(Order order)
    {
        await _db.Orders.AddAsync(order);
        var rows = await _db.SaveChangesAsync();
        Console.WriteLine($"[OrderRepository] Added and saved Order {order.Id}. Rows affected: {rows}");
    }


    public async Task SaveChangesAsync() =>
        await _db.SaveChangesAsync();


    public async Task UpdateAsync(Order order)
    {
        var dbOrder = await _db.Orders.FindAsync(order.Id);
        if (dbOrder != null)
        {
            dbOrder.Status = order.Status;
            await _db.SaveChangesAsync();
        }
    }


}
