using System;
using System.Collections.Generic;
using System.Linq;

namespace backend_dash.Domain;

public class DigitalFactory
    {

        public string Ref { get; set; } = null!;
        public string? Name { get; set; }
        
        public List<DigitalModule> DigitalModules { get; } = new();

        public List<TransportModule> TransportModules { get; } = new();
        
        public Store? MainStore { get; private set; }
        public List<FixedModule> FixedModulesList { get; } = new();

        // List of all orders
        public List<Order> Orders { get; } = new();

        // Add a digital module
        public void AddModule(DigitalModule module)
        {
            if (module == null) throw new ArgumentNullException(nameof(module));
            if (!DigitalModules.Contains(module))
                DigitalModules.Add(module);

            switch (module)
            {
                case TransportModule tm:
                    if (!TransportModules.Contains(tm)) TransportModules.Add(tm); 
                    break;

                case FixedModule fm:
                    if (!FixedModulesList.Contains(fm)) FixedModulesList.Add(fm);
                    break;

                case Store s:
                    MainStore ??= s;
                    break;
            }
        }

        public IEnumerable<TransportModule> GetTransportModules() =>
            DigitalModules.OfType<TransportModule>();

        // Get all fixed modules
        public IEnumerable<FixedModule> GetFixedModules() =>
            DigitalModules.OfType<FixedModule>();

        public Store? GetStore() => MainStore;

        // Add an order
        public void AddOrder(Order order)
        {
            if (order == null) throw new ArgumentNullException(nameof(order));
            if (!Orders.Contains(order))
                Orders.Add(order);

        order.Factory = this;


        }

        public List<Order> GetAllOrders() => Orders;

        // Get all workpieces
        public IEnumerable<Workpiece> GetAllWorkpieces() =>
            Orders.SelectMany(o => o.Workpieces);

        // Find order by Id
        public Order? GetOrderById(string id) =>
            Orders.FirstOrDefault(o => o.Id == id);

        // Find module by serial number (generic)
        public T? GetModuleBySerialNumber<T>(string serialNumber) where T : DigitalModule =>
            DigitalModules.OfType<T>().FirstOrDefault(m => m.SerialNumber == serialNumber);

        // Display factory status
        public void PrintStatus()
        {
            Console.WriteLine("=== Factory Status ===");
            Console.WriteLine($"Digital Modules: {DigitalModules.Count}");
            Console.WriteLine($"  Fixed Modules: {FixedModulesList.Count}");
            Console.WriteLine($"  Transport Modules: {GetTransportModules().Count()}");
            Console.WriteLine($"  Main Transport Module: {(TransportModules[0] != null ? TransportModules[0].Name : "None")}");
            Console.WriteLine($"  Store: {(MainStore != null ? MainStore.Name : "None")}");
            Console.WriteLine($"Orders: {Orders.Count}");
            Console.WriteLine($"Workpieces: {GetAllWorkpieces().Count()}");
            Console.WriteLine("=====================");
        }
    }
