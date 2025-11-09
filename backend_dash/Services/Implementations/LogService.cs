using backend_dash.Domain;
using backend_dash.Repositories;
using backend_dash.Repositories;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend_dash.Services
{
    public class LogService : ILogService
    {
        private readonly IServiceProvider _provider;

        public LogService(IServiceProvider provider)
        {
            _provider = provider;
        }
        public async Task AddWorkpieceLogAsync(WorkpieceLog log)
        {
            using var scope = _provider.CreateScope();

            var logRepo = scope.ServiceProvider.GetRequiredService<IWorkpieceLogRepository>();
            var wpRepo = scope.ServiceProvider.GetRequiredService<IWorkpieceRepository>();

            // Update the workpiece state using UpdateStateAsync
            if (!string.IsNullOrEmpty(log.WorkpieceId))
            {
                await wpRepo.UpdateStateAsync(log.WorkpieceId, log.State);
            }

            // Add the workpiece log
            await logRepo.AddAsync(log);
        }


        public async Task AddModuleLogAsync(ModuleLog log)
        {
            using var scope = _provider.CreateScope();
            var repo = scope.ServiceProvider.GetRequiredService<IModuleLogRepository>();
            await repo.AddAsync(log);
        }

        public async Task<IEnumerable<WorkpieceLog>> GetWorkpieceLogsAsync(string? workpieceId = null, string? state = null,string? orderId=null)
        {
            using var scope = _provider.CreateScope();
            var repo = scope.ServiceProvider.GetRequiredService<IWorkpieceLogRepository>();
            return await repo.GetAsync(workpieceId, state,orderId);
        }

        public async Task<IEnumerable<ModuleLog>> GetModuleLogsAsync(string? moduleSerial = null, string? status = null)
        {
            using var scope = _provider.CreateScope();
            var repo = scope.ServiceProvider.GetRequiredService<IModuleLogRepository>();
            return await repo.GetAsync(moduleSerial, status);
        }
    }
}
