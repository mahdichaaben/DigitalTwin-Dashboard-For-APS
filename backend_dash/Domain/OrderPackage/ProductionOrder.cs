using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend_dash.Domain;

public class ProductionOrder : Order
{

    public ProductionOrder() : base()
    {
    }
    public ProductionOrder(string? id = null, string? requestedBy = null)
        : base(id, requestedBy)
    {
    }

    public override void GenerateCommands()
    {
        var factory = Factory ?? throw new InvalidOperationException("Factory must be assigned before generating commands.");
        if (factory.TransportModules.Count == 0)
            throw new InvalidOperationException("No transport (AGV) module available in the factory.");

        var agv = factory.TransportModules[0];

        var store = factory.GetStore();

        var hbw = store.StorageModules[0];



        var dpsModule = factory.GetModuleBySerialNumber<FixedModule>("DPS001");





        foreach (var wp in Workpieces)
        {


            var transportCmd = new TransportCommand(
            id: $"agv-{Guid.NewGuid():N}",
            commandName: "MOVE",
            state: "PENDING",
            orderId:Id,
            fromNodeRef: dpsModule.Position,
            toNodeRef: hbw.Position

             )
            {
                Module = agv,
               // Metadata = { ["id"] = wp.Id, ["type"] = wp.Type.Color }
            };

            agv.ActionHistory.Add(transportCmd);
            Commands.Add(transportCmd);



            var locationWp = hbw.GetWorkpieceSlot(wp.Id);

            //var removedWp = hbw.RemoveWorkpiece(locationWp);

            //hbw.SyncDictionaryToSlots();

            //if (removedWp != null)
            //{
            //    Console.WriteLine($"Removed workpiece {removedWp.Id}");
            //}
            //else
            //{
            //    Console.WriteLine("No workpiece in that slot.");
            //}



            //hbw.SyncDictionaryToSlots();

          

            var hbwactiondrop = new TaskCommand($"hbw-{Guid.NewGuid():N}", "DROP", "PENDING",Id)
            {
                Module = hbw,
                Metadata = { ["id"] = wp.Id, ["type"] = wp.Type.Color  },
                OrderId = Id,
                OrderUpdateId = 3
            };

            var location = hbw.GetWorkpieceSlot(wp.Id) ?? "A1";



            hbwactiondrop.ActionExtraFields["rackPosition"] = "A2";

            hbwactiondrop.ActionExtraFields["rackPosition"] = location;
            hbw.ActionHistory.Add(hbwactiondrop);

            Commands.Add(hbwactiondrop);

            var Storecmd = new StoreCommand(
                id: $"store-{Guid.NewGuid():N}",
                commandName: "REMOVE",
                status: "PENDING",
                orderId: Id,
                workpieceId: wp.Id,
                location: location,
                type: wp.Type.Name,
                state: wp.State
            )
            {

                Module=store
            }
        ;

            store.ActionHistory.Add(Storecmd);
            Commands.Add(Storecmd);


            var compatibleModules = wp.Type.ModuleLinks
                                        .OrderBy(link => link.Order)  
                                        .Select(link => link.FixedModule)
                                        .ToList();




            // Debug output
            Console.WriteLine("---- Debug: Compatible Modules Order ----");
            foreach (var link in wp.Type.ModuleLinks.OrderBy(l => l.Order))
            {
                Console.WriteLine($"Order: {link.Order}, Module: {link.FixedModule.Name} ({link.FixedModule.SerialNumber})");
            }
            Console.WriteLine("----------------------------------------");



            if (compatibleModules == null || compatibleModules.Count == 0)
                continue;

            FixedModule? previousModule = hbw;


            foreach (var module in compatibleModules)
            {

                    

                    var transportingCmd = new TransportCommand(
                        id: $"agv-{Guid.NewGuid():N}",
                        commandName: "MOVE",
                        state: "PENDING",
                        orderId: Id,
                        fromNodeRef: previousModule.Position,
                        toNodeRef: module.Position
                    )
                    {

                        Metadata = { ["id"] = wp.Id, ["type"] = wp.Type.Color },
                        Module = agv
                    };

                    agv.ActionHistory.Add(transportingCmd);
                    Commands.Add(transportingCmd);


                Console.WriteLine("for start:");
                foreach (var task in module.Proces.OrderBy(t => t.Order))
                {

                    Console.WriteLine("debug name :", task.Name);


                    var taskCmd = new TaskCommand(
                        id: $"task-{Guid.NewGuid():N}",
                        command: task.Name,
                        state: "PENDING",
                        orderId: Id
                    )
                    {
                        Metadata = { ["id"] = wp.Id, ["type"] = wp.Type.Color },
                        Module = module
                    };

                    module.AddAction(taskCmd);
                    Commands.Add(taskCmd); 
                }


                Console.WriteLine("for end:");


                previousModule = module;
            }
        }
    }
}
