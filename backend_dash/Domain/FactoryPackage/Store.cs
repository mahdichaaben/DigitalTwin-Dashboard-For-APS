using System;
using System.Collections.Generic;
using System.Text.Json;

namespace backend_dash.Domain;

public class Store : DigitalModule
    {
        public List<StorageModule> StorageModules { get; set; } = new();

        public Store(string serialNumber, string topicState, string topicCommand, string name)
            : base(serialNumber, topicState, topicCommand)
        {
            Name = name;
        }



        public override void OnMessageReceived(string msg)
        {
            Console.WriteLine($"[{Name}] received message: {msg}");

            try
            {
                using var doc = JsonDocument.Parse(msg);
                var root = doc.RootElement;

                // 1️⃣ Update stock items
                if (root.TryGetProperty("stockItems", out var stockItemsJson) && stockItemsJson.ValueKind == JsonValueKind.Array)
                {

                this.ClearWorkpieces();
                // Add the workpiece to the module's current list



                foreach (var item in stockItemsJson.EnumerateArray())
                    {
                        var hbwSerial = item.GetProperty("hbw").GetString() ?? "";
                        var location = item.GetProperty("location").GetString() ?? "";
                        var wpJson = item.GetProperty("workpiece");

                        var workpieceId = wpJson.GetProperty("id").GetString() ?? "";





                    // check if workpieceId length isnt null 
                    Console.WriteLine($"this is finded from json --> {workpieceId}");

                        var workpiece = factory?.GetAllWorkpieces().FirstOrDefault(wp => wp.Id == workpieceId);
                    var storageModule = StorageModules.Find(m => m.Position == hbwSerial);





                        // Find the corresponding StorageModule by HBW serial
                        if (storageModule != null)
                        {
                        if (workpiece == null)
                        {
                            Console.WriteLine($"slot {location} is empty");
                            storageModule.ClearSlot(location);
                         //   this.RemoveWorkpiece(workpiece);

                        }
                        else
                        {

                            storageModule.AssignWorkpiece(location, workpiece);

                         //   this.AddWorkpiece(workpiece);

                            storageModule.SyncDictionaryToSlots();


                        }

    



                    }
                    else
                        {
                            Console.WriteLine($"No StorageModule found with HBW {hbwSerial}");
                        }



                    }






            }





            // 2️⃣ Process command
            if (root.TryGetProperty("command", out var cmdJson))
                {
                    var hbwSerial = cmdJson.GetProperty("hbwSerial").GetString() ?? "";
                    var storageModule = StorageModules.Find(m => m.Position == hbwSerial);

                    if (storageModule != null)
                    {
                        var cmd = new StoreCommand(
                            id: cmdJson.GetProperty("id").GetString() ?? Guid.NewGuid().ToString(),
                            commandName: cmdJson.GetProperty("command").GetString() ?? "UNKNOWN",
                            status: cmdJson.GetProperty("status").GetString() ?? "RUNNING",
                            orderId: cmdJson.GetProperty("orderId").GetString() ?? "RUNNING",
                            workpieceId: cmdJson.GetProperty("workpieceId").GetString() ?? "",
                            location: cmdJson.GetProperty("location").GetString() ?? "",
                            type: cmdJson.GetProperty("type").GetString() ?? "RAW",
                            state: cmdJson.GetProperty("state").GetString() ?? "RAW"
                        )
                        {
                            Module = storageModule

                        }
                ;

                        CurrentAction = cmd;


                        UpdateAction(cmd);


                        RaiseStatusChanged();
                    }
                    else
                    {
                        Console.WriteLine($"Command HBW {hbwSerial} does not match any StorageModule");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error processing store message: {ex.Message}");
            }
        }


        protected override void UpdateAction(Command updatedAction)
        {
            if (updatedAction == null) return;

            var existing = ActionHistory.FirstOrDefault(a => a.Id == updatedAction.Id);
            if (existing != null)
            {
                existing.Status = updatedAction.Status;
                existing.Metadata = updatedAction.Metadata;
                existing.Timestamp = updatedAction.Timestamp;


                CurrentAction = existing;
            }
            else
            {
                ActionHistory.Add(updatedAction);
                CurrentAction = updatedAction;
            }


            Status = CurrentAction.Status;

            RaiseStatusChanged();
        }
    }
