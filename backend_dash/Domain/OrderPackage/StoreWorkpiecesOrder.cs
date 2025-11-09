using System;
using System.Linq;

namespace backend_dash.Domain;
public class StoreWorkpiecesOrder : Order
    {

    public StoreWorkpiecesOrder() : base()
    {
    }


    public StoreWorkpiecesOrder(string? id = null, string? requestedBy = null)
        : base(id, requestedBy)
    {
        // All properties like Status, CreatedAt are handled by base constructor
    }



    public override void GenerateCommands()
        {
            var factory = Factory ?? throw new InvalidOperationException("Factory must be assigned before generating commands.");
            var store = factory.GetStore() ?? throw new InvalidOperationException("No store defined in factory.");

            foreach (var wp in Workpieces)
            {
                var hbwModule = store.StorageModules.FirstOrDefault(m => m.HasSpace());
                if (hbwModule == null)
                {
                    Console.WriteLine($"No available storage module for workpiece {wp.Id}");
                    continue;
                }

                // Find first empty slot
                var slot = hbwModule.FindFirstAvailableSlot();
                if (slot == null)
                {
                    Console.WriteLine($"No available slot in module {hbwModule.Name} for workpiece {wp.Id}");
                    continue;
                }
                hbwModule.AssignWorkpiece(slot, wp);

                hbwModule.SyncDictionaryToSlots();



            //hbwModule.AddWorkpiece(slot, wp);
            var cmd = new StoreCommand(
                    id: $"storage-{Guid.NewGuid():N}",
                    commandName: "ADD",
                    status: "PENDING",
                    orderId: Id,
                    workpieceId: wp.Id,
                    location: slot,
                    type: wp.Type.Name,
                    state: wp.State
                )
                {

                    Module=store
                }
        ;

                store.AddAction(cmd);
                Commands.Add(cmd);
            }
        }
    }

