using backend_dash.Domain;
using System.Collections.Concurrent;

public static class OrderPool
{
    private static readonly ConcurrentQueue<ProductionOrder> _productionOrders = new();
    private static readonly ConcurrentQueue<Order> _storeOrders = new();

    // ===== Production Orders =====
    public static void AddProductionOrder(ProductionOrder order)
    {
        if (order == null) throw new ArgumentNullException(nameof(order));
        _productionOrders.Enqueue(order);
    }

    public static bool TryGetNextProductionOrder(out ProductionOrder? order)
    {
        return _productionOrders.TryDequeue(out order);
    }

    public static List<ProductionOrder> GetAllProductionOrders() => _productionOrders.ToList();

    // ===== Store Orders =====
    public static void AddStoreOrder(Order order)
    {
        if (order == null) throw new ArgumentNullException(nameof(order));
        _storeOrders.Enqueue(order);
    }

    public static bool TryGetNextStoreOrder(out Order? order)
    {
        return _storeOrders.TryDequeue(out order);
    }

    public static List<Order> GetAllStoreOrders() => _storeOrders.ToList();
}
