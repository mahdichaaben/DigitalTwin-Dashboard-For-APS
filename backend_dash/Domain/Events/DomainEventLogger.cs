using backend_dash.Domain;
using backend_dash.Repositories;
using backend_dash.Services;
using backend_dash.WebApi.Hubs;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;

namespace backend_dash.Domain.Events
{
    public class DomainEventLogger
    {
        private readonly ILogService _logService;
        private readonly RealTimeLogger _dispatcher;

        public DomainEventLogger(
            ILogService logService,
            RealTimeLogger dispatcher)
        {
            _logService = logService;
            _dispatcher = dispatcher;
        }

        public void LogWorkpieceStateChange(Workpiece wp)
        {

            Console.WriteLine($"Workpiece ID: {wp.Id}");
            Console.WriteLine($"Order attached? {(wp.Order != null)}");

            if (wp.Order != null)
            {
                Console.WriteLine($"Order ID: {wp.Order.Id}");
            }
            else
            {
                Console.WriteLine("Order is null");
            }

            
            var log = new WorkpieceLog
            {
                WorkpieceId = wp.Id,
                WorkpieceType = wp.Type?.Name,
                State = wp.State,
                OrderId = wp.Order?.Id,
                ModuleSerial = wp.LastProcessedModule?.SerialNumber,
                Timestamp = DateTime.UtcNow
            };

            _ = _logService.AddWorkpieceLogAsync(log);
            _ = _dispatcher.NotifyWorkpieceChanged(log);


        }

        public void LogModuleStatusChange(DigitalModule module)
        {
            if (module.CurrentWorkpieces.Any())
            {
                foreach (var wp in module.CurrentWorkpieces)
                {
                    var log = new ModuleLog
                    {
                        ModuleSerialNumber = module.SerialNumber,
                        ModuleName = module.Name,
                        ModuleState = module.ComponentState,
                        Status = module.Status,
                        CommandName = module.CurrentAction?.CommandName,
                        wpId = wp.Id,
                        Timestamp = DateTime.UtcNow
                    };

                    _ = _logService.AddModuleLogAsync(log);
                    _ = _dispatcher.NotifyModuleChanged(log);


                }
            }
            else
            {
                var log = new ModuleLog
                {
                    ModuleSerialNumber = module.SerialNumber,
                    ModuleName = module.Name,
                    Status = module.Status,
                    CommandName = module.CurrentAction?.CommandName,
                    Timestamp = DateTime.UtcNow
                };

                _ = _logService.AddModuleLogAsync(log);
                _ = _dispatcher.NotifyModuleChanged(log);
            }
        }
    }
}
