using System;
using System.Linq;

namespace backend_dash.Domain;

public class RetrieveWorkpiecesOrder : Order
{
    public RetrieveWorkpiecesOrder() : base()
    {
    }

    public RetrieveWorkpiecesOrder(string? id = null, string? requestedBy = null)
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
            // Find the module that contains this workpiece
            var hbwModule = store.StorageModules
                .FirstOrDefault(m => m.ContainsWorkpiece(wp.Id));

            if (hbwModule == null)
            {
                Console.WriteLine($"Workpiece {wp.Id} not found in any storage module.");
                continue;
            }

            // Find slot and remove workpiece
            var slot = hbwModule.GetWorkpieceSlot(wp.Id);
            if (slot == null)
            {
                Console.WriteLine($"Workpiece {wp.Id} has no assigned slot in module {hbwModule.Name}.");
                continue;
            }
            //var removedWp = hbwModule.RemoveWorkpiece(slot);
            //if (removedWp == null)
            //{
            //    continue; // nothing to remove
            //}

            //hbwModule.SyncDictionaryToSlots();


            // Generate REMOVE command
            var cmd = new StoreCommand(
                id: $"unstorage-{Guid.NewGuid():N}",
                commandName: "REMOVE",
                status: "PENDING",
                orderId: Id,
                workpieceId: wp.Id,
                location: slot,
                type: wp.Type.Name,
                state: wp.State
            )
            {
                Module = store
            };

            store.AddAction(cmd);
            Commands.Add(cmd);
        }
    }


}
