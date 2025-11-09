using backend_dash.Domain;
using backend_dash.Infrastructure.Data;
using backend_dash.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace backend_dash.Repositories.implementations;


public class DigitalFactoryRepository : IDigitalFactoryRepository
{
    private readonly DigitalFactory _factory;
    private readonly AppDbContext _dbContext;
    public DigitalFactoryRepository(DigitalFactory factory,AppDbContext dbContext)
    {
        _factory = factory;
        _dbContext = dbContext;

    }

    public DigitalFactory GetFactory() => _factory;

    public FixedModule? GetFixedModuleById(string id) =>
        _factory.DigitalModules.OfType<FixedModule>().FirstOrDefault(m => m.SerialNumber == id);

    public StorageModule? GetStorageModuleById(string id) =>
        _factory.DigitalModules.OfType<StorageModule>().FirstOrDefault(m => m.SerialNumber == id);

    public TransportModule? GetTransportModuleById(string id) =>
        _factory.DigitalModules.OfType<TransportModule>().FirstOrDefault(m => m.SerialNumber == id);

    public Store? GetStore() =>
        _factory.DigitalModules.OfType<Store>().FirstOrDefault();

    public IEnumerable<FixedModule> GetAllFixedModules() =>
        _factory.DigitalModules.OfType<FixedModule>();

    public IEnumerable<StorageModule> GetAllStorageModules() =>
        _factory.DigitalModules.OfType<StorageModule>();

    public IEnumerable<TransportModule> GetAllTransportModules() =>
        _factory.DigitalModules.OfType<TransportModule>();

    public IEnumerable<DigitalModule> GetAllModules() =>
        _factory.DigitalModules;




    public async Task UpdateFactoryAsync(DigitalFactory updatedFactory)
    {

        _dbContext.DigitalFactories.Update(updatedFactory);

        await _dbContext.SaveChangesAsync();
    }




}