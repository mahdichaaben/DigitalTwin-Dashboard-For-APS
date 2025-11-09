using backend_dash.Domain;
using System.Reflection;

namespace backend_dash.Repositories;

public interface IDigitalFactoryRepository
{
    DigitalFactory GetFactory();
    FixedModule? GetFixedModuleById(string id);
    StorageModule? GetStorageModuleById(string id);
    TransportModule? GetTransportModuleById(string id);
    Store? GetStore();
    IEnumerable<FixedModule> GetAllFixedModules();
    IEnumerable<StorageModule> GetAllStorageModules();
    IEnumerable<TransportModule> GetAllTransportModules();
    IEnumerable<DigitalModule> GetAllModules();

    Task UpdateFactoryAsync(DigitalFactory updatedFactory);



}
