using System;
using System.Collections.Generic;
using System.Linq;
using System.ComponentModel.DataAnnotations;

namespace backend_dash.Domain;

public class StorageModule : FixedModule
{
    public int Capacity { get; private set; }

    public Dictionary<string, Workpiece?> StoredWorkpieces { get; private set; } = new();

    public List<StorageSlot> Slots { get; private set; } = new();

    public StorageModule(string serialNumber, string topicState, string topicCommand, string name, string position, int capacity = 0)
        : base(serialNumber, topicState, topicCommand, name, position)
    {
        Capacity = capacity;
    }

    // Sync dictionary with EF Slots
    public void SyncDictionaryToSlots()
    {
        Slots.Clear();
        foreach (var kvp in StoredWorkpieces)
        {
            Slots.Add(new StorageSlot
            {
                SlotName = kvp.Key,
                Workpiece = kvp.Value,
                StorageModule = this
            });
        }
    }

    public void SyncSlotsToDictionary()
    {
        StoredWorkpieces.Clear();
        foreach (var slot in Slots)
        {
            StoredWorkpieces[slot.SlotName] = slot.Workpiece;
        }
    }

    public bool AssignWorkpiece(string slot, Workpiece workpiece)
    {
        if (StoredWorkpieces.Count >= Capacity)
            return false;

        StoredWorkpieces[slot] = workpiece;

        // Update state
        workpiece.LastProcessedModule = this;
        workpiece.State = "STORED in " + SerialNumber;

        return true;
    }


    public Workpiece? RemoveWorkpiece(string slot)
    {
        if (StoredWorkpieces.TryGetValue(slot, out var workpiece) && workpiece != null)
        {
            StoredWorkpieces[slot] = null;
            workpiece.LastProcessedModule = null;
            workpiece.State = "FREE";
            return workpiece;
        }

        return null;
    }


    public void ClearSlot(string slot)
    {
        if (StoredWorkpieces.ContainsKey(slot))
        {
            StoredWorkpieces[slot] = null;
        }
        SyncDictionaryToSlots();
    }




    public bool HasSpace() => StoredWorkpieces.Values.Contains(null);

    public string? FindFirstAvailableSlot() => StoredWorkpieces.FirstOrDefault(kvp => kvp.Value == null).Key;

    public int CountAvailableSlots() => StoredWorkpieces.Values.Count(v => v == null);

    public string? GetWorkpieceSlot(string workpieceId) => StoredWorkpieces.FirstOrDefault(kvp => kvp.Value?.Id == workpieceId).Key;

    public bool ContainsWorkpiece(string workpieceId) => GetWorkpieceSlot(workpieceId) != null;
}
