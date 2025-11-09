using backend_dash.Domain;
using backend_dash.Repositories;

namespace backend_dash.Services;

public class FactoryService
{

    private readonly IDigitalFactoryRepository _factoryRepo;

    public FactoryService(IDigitalFactoryRepository factoryRepo)
    {
        _factoryRepo = factoryRepo;
    }
    public DigitalFactory GetFactory() => _factoryRepo.GetFactory();

    public IEnumerable<DigitalModule> GetAllDigitalModules() =>
        _factoryRepo.GetFactory().DigitalModules;


    public DigitalModule? GetDigitalModuleById(string serialNumber) =>
        _factoryRepo.GetFactory().DigitalModules
                    .FirstOrDefault(m => m.SerialNumber == serialNumber);

    public FixedModule? GetFixedModule(string id) => _factoryRepo.GetFixedModuleById(id);

    public IEnumerable<FixedModule> GetAllFixedModules() => _factoryRepo.GetAllFixedModules();

    public StorageModule? GetStorageModule(string id) => _factoryRepo.GetStorageModuleById(id);

    public IEnumerable<StorageModule> GetAllStorageModules() => _factoryRepo.GetAllStorageModules();

    public TransportModule? GetTransportModule(string id) => _factoryRepo.GetTransportModuleById(id);

    public IEnumerable<TransportModule> GetAllTransportModules() => _factoryRepo.GetAllTransportModules();

    public Store? GetStore() => _factoryRepo.GetStore();




}
