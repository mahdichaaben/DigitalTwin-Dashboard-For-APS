using backend_dash.Domain;
using backend_dash.Infrastructure.Messaging;
using backend_dash.Repositories;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace backend_dash.Services
{
    public class OrderExecutorService : BackgroundService
    {
        private readonly Executor _executor;
        private readonly IServiceScopeFactory _scopeFactory;

        public OrderExecutorService(Executor executor, IServiceScopeFactory scopeFactory)
        {
            _executor = executor ?? throw new ArgumentNullException(nameof(executor));
            _scopeFactory = scopeFactory ?? throw new ArgumentNullException(nameof(scopeFactory));
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            Console.WriteLine("[OrderExecutorService] Started.");

            // Run both loops concurrently and keep them alive
            var productionLoop = RunProductionLoop(stoppingToken);
            var storeLoop = RunStoreLoop(stoppingToken);

            await Task.WhenAll(productionLoop, storeLoop);
        }

        private async Task RunProductionLoop(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    while (OrderPool.TryGetNextProductionOrder(out var order))
                    {
                        if (stoppingToken.IsCancellationRequested) break;

                        using var scope = _scopeFactory.CreateScope();
                        var orderRepository = scope.ServiceProvider.GetRequiredService<IOrderRepository>();

                        Console.WriteLine($"[OrderExecutorService] Executing Production Order {order.Id}");

                        order.Status = "IN_PROGRESS";
                        await orderRepository.UpdateAsync(order);

                        await _executor.ProcessCommandsSequentiallyAsync(order.Commands, stoppingToken);

                        order.Status = "FINISHED";
                        await orderRepository.UpdateAsync(order);

                        Console.WriteLine($"[OrderExecutorService] Finished Production Order {order.Id}");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[OrderExecutorService] ERROR in ProductionLoop: {ex}");
                    // prevent loop from dying, just wait a bit
                }

                await Task.Delay(1000, stoppingToken);
            }
        }

        private async Task RunStoreLoop(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    while (OrderPool.TryGetNextStoreOrder(out var order))
                    {
                        if (stoppingToken.IsCancellationRequested) break;

                        using var scope = _scopeFactory.CreateScope();
                        var orderRepository = scope.ServiceProvider.GetRequiredService<IOrderRepository>();

                        Console.WriteLine($"[OrderExecutorService] Executing Store Order {order.Id}");

                        order.Status = "IN_PROGRESS";
                        await orderRepository.UpdateAsync(order);

                        await _executor.ProcessCommandsSequentiallyAsync(order.Commands, stoppingToken);

                        order.Status = "FINISHED";
                        await orderRepository.UpdateAsync(order);

                        Console.WriteLine($"[OrderExecutorService] Finished Store Order {order.Id}");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[OrderExecutorService] ERROR in StoreLoop: {ex}");
                }

                await Task.Delay(1000, stoppingToken);
            }
        }

        public override Task StopAsync(CancellationToken cancellationToken)
        {
            Console.WriteLine("[OrderExecutorService] Stopping...");
            return base.StopAsync(cancellationToken);
        }
    }
}
