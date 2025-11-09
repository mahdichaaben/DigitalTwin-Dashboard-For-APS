using backend_dash.Domain;
using backend_dash.Domain.Events;
using backend_dash.Repositories;

namespace backend_dash.Services;

public class OrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IWorkpieceRepository _workpieceRepository;
    private readonly IDigitalFactoryRepository _digitalFactoryRepository;
    private readonly WorkpieceEventHandler _workpieceEventHandler;
    public OrderService(IOrderRepository orderRepository, IWorkpieceRepository workpieceRepository, IDigitalFactoryRepository digitalFactoryRepository, WorkpieceEventHandler workpieceEventHandler)
    {
        _orderRepository = orderRepository;
        _workpieceRepository = workpieceRepository;
        _digitalFactoryRepository = digitalFactoryRepository;
        _workpieceEventHandler = workpieceEventHandler;
    }
    public async Task<Order?> GetOrderByIdAsync(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
            throw new ArgumentException("Order ID cannot be empty.", nameof(id));

        return await _orderRepository.GetByIdAsync(id);
    }

    public async Task<List<Order>> GetAllOrdersAsync()
    {
        return await _orderRepository.GetAllAsync();
    }


    public async Task<Order> CreateStoreOrderAsync(
    string factoryId,
    string requestedBy,
    List<string> workpieceIds)
    {
        if (string.IsNullOrWhiteSpace(requestedBy))
            throw new ArgumentException("RequestedBy cannot be empty.", nameof(requestedBy));

        if (workpieceIds == null || workpieceIds.Count == 0)
            throw new ArgumentException("At least one workpiece ID must be provided.", nameof(workpieceIds));

        // Fetch workpieces
        var workpieces = await _workpieceRepository.GetByIdsAsync(workpieceIds);




        // Validate missing workpieces
        var missingIds = workpieceIds.Except(workpieces.Select(wp => wp.Id)).ToList();
        if (missingIds.Any())
            throw new InvalidOperationException($"Workpieces not found: {string.Join(", ", missingIds)}");

        var factory = _digitalFactoryRepository.GetFactory();


        var order = new StoreWorkpiecesOrder()
        {
            Id = Guid.NewGuid().ToString(),
            RequestedBy = requestedBy,
            Status = "PENDING",
            CreatedAt = DateTime.UtcNow
        };


        factory.AddOrder(order);

        await _orderRepository.AddAsync(order);



        order.AddWorkpiecesRange(workpieces);

        foreach (var wp in workpieces)
        {

            wp.Order = order;
            Console.WriteLine($"this id of wp: {wp.Order.Id}");
            
            _workpieceEventHandler.Subscribe(wp);

        }



       // factory.AddOrder(order);





        var commandNames = string.Join(" | ", order.Commands.Select(c => c.CommandName));
        Console.WriteLine(commandNames);

        order.Factory = factory;

        factory.Orders.Add(order);


        order.GenerateCommands();

        foreach( var command in order.Commands)
        {
            Console.WriteLine(command.CommandName);
        }

        
        // Persist


        OrderPool.AddStoreOrder(order);



        return order;
    }





    public async Task<Order> CreateProductionOrderAsync(
    string factoryId,
    string requestedBy,
    List<string> workpieceIds)
    {
        if (string.IsNullOrWhiteSpace(requestedBy))
            throw new ArgumentException("RequestedBy cannot be empty.", nameof(requestedBy));

        if (workpieceIds == null || workpieceIds.Count == 0)
            throw new ArgumentException("At least one workpiece ID must be provided.", nameof(workpieceIds));


        var workpieces = await _workpieceRepository.GetByIdsAsync(workpieceIds);
       
        

        

        var missingIds = workpieceIds.Except(workpieces.Select(wp => wp.Id)).ToList();
        if (missingIds.Any())
            throw new InvalidOperationException($"Workpieces not found: {string.Join(", ", missingIds)}");

        var factory = _digitalFactoryRepository.GetFactory();
        if (factory == null || factory.Ref != factoryId)
            throw new InvalidOperationException($"Factory with ID '{factoryId}' not found.");

        // Create the ProductionOrder
        var order = new ProductionOrder()
        {
            Id = Guid.NewGuid().ToString(),
            RequestedBy = requestedBy,
            Status = "PENDING",
            CreatedAt = DateTime.UtcNow,
        };

        factory.AddOrder(order);

        await _orderRepository.AddAsync(order);


        order.AddWorkpiecesRange(workpieces);


        foreach (var wp in workpieces)
        {

            wp.Order = order;
            Console.WriteLine("this id of wp:", wp.Order.Id);
            _workpieceEventHandler.Subscribe(wp);

        }


        
        


        order.GenerateCommands();

        

        var commandNames = string.Join(" | ", order.Commands.Select(c => c.CommandName));
        Console.WriteLine(commandNames);




        



        

        OrderPool.AddProductionOrder(order);



        return order;
    }



    public async Task<Order> CreateUnstoreOrderAsync(
    string factoryId,
    string requestedBy,
    List<string> workpieceIds)
    {
        if (string.IsNullOrWhiteSpace(requestedBy))
            throw new ArgumentException("RequestedBy cannot be empty.", nameof(requestedBy));

        if (workpieceIds == null || workpieceIds.Count == 0)
            throw new ArgumentException("At least one workpiece ID must be provided.", nameof(workpieceIds));


        var workpieces = await _workpieceRepository.GetByIdsAsync(workpieceIds);

        var missingIds = workpieceIds.Except(workpieces.Select(wp => wp.Id)).ToList();
        if (missingIds.Any())
            throw new InvalidOperationException($"Workpieces not found: {string.Join(", ", missingIds)}");

        var factory = _digitalFactoryRepository.GetFactory();
        if (factory == null || factory.Ref != factoryId)
            throw new InvalidOperationException($"Factory with ID '{factoryId}' not found.");

        var order = new RetrieveWorkpiecesOrder()
        {
            Id = Guid.NewGuid().ToString(),
            RequestedBy = requestedBy,
            Status = "PENDING",
            CreatedAt = DateTime.UtcNow
        };

        factory.AddOrder(order);

        order.Factory = factory;


        await _orderRepository.AddAsync(order);

        order.AddWorkpiecesRange(workpieces);


        foreach (var wp in workpieces)
        {

            wp.Order = order;
            Console.WriteLine("this id of wp:",wp.Order.Id);
            _workpieceEventHandler.Subscribe(wp);

        }



        order.GenerateCommands();

        foreach (var command in order.Commands)
        {
            Console.WriteLine(command.CommandName);
        }

       

        // Persist
        
        //await _orderRepository.SaveChangesAsync();

        OrderPool.AddStoreOrder(order);


        return order;
    }
}
