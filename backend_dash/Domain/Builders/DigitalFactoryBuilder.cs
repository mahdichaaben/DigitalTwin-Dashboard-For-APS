using System.Collections.Generic;

namespace backend_dash.Domain
{
    public class DigitalFactoryBuilder
    {
        public DigitalFactory BuildFactory()
        {
            var factory = new DigitalFactory
            {
                Ref = "FACTORY001",
                Name = "Main Digital Factory"
            };
            

            // 1. Fixed Modules
            var dpsModule = new FixedModule("DPS001", "module/v1/ff/DPS001/state", "module/v1/ff/DPS001/order", "DPS Module", "SVR4PW6408");
            var drillModule = new FixedModule("DRILL001", "module/v1/ff/DRILL001/state", "module/v1/ff/DRILL001/order", "Drill Module", "SVR5H85384");
            var millModule = new FixedModule("MILL001", "module/v1/ff/MILL001/state", "module/v1/ff/MILL001/order", "Mill Module", "SVR5H59286");
            var aiqsModule = new FixedModule("AIQS001", "module/v1/ff/AIQS001/state", "module/v1/ff/AIQS001/order", "AIQS Module", "SVR4LR8731");

            factory.AddModule(dpsModule);
            factory.AddModule(drillModule);
            factory.AddModule(millModule);
            factory.AddModule(aiqsModule);

            dpsModule.factory = factory;
            drillModule.factory = factory;
            millModule.factory = factory;
            aiqsModule.factory = factory;

            // 2. Define tasks per module
            dpsModule.AddTask(new TaskFixedModule("t1", "PICK", 1));

            drillModule.AddTask(new TaskFixedModule("t1drillModule", "PICK", 1));
            drillModule.AddTask(new TaskFixedModule("t2drillModule", "DRILL", 2));
            drillModule.AddTask(new TaskFixedModule("t3drillModule", "DROP", 3));

            millModule.AddTask(new TaskFixedModule("t1millModule", "PICK", 1));
            millModule.AddTask(new TaskFixedModule("t2millModule", "MILL", 2));
            millModule.AddTask(new TaskFixedModule("t3millModule", "DROP", 3));

            aiqsModule.AddTask(new TaskFixedModule("t1aiqsModule", "PICK", 1));
            aiqsModule.AddTask(new TaskFixedModule("t2aiqsModule", "CHECK_QUALITY", 2));
            aiqsModule.AddTask(new TaskFixedModule("t3aiqsModule", "DROP", 3));

            // 3. HBW Storage module
            var hbwModule = new StorageModule(
                serialNumber: "HBW001",
                topicState: "module/v1/ff/HBW001/state",
                topicCommand: "module/v1/ff/HBW001/order",
                name: "HBW Storage Module",
                position: "SVR5H85409",
                capacity: 20
            );

            var slots = new List<string> { "A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3" };
            foreach (var slot in slots)
                hbwModule.StoredWorkpieces[slot] = null;


            hbwModule.SyncDictionaryToSlots();
            factory.AddModule(hbwModule);
            hbwModule.factory = factory;

            // 4. AGV Transport module
            var agvModule = new TransportModule("80F4", "fts/v1/ff/80F4/state", "fts/v1/ff/80F4/order", "AGV Module");
            factory.AddModule(agvModule);
            agvModule.factory = factory;

            // 5. Store
            var store = new Store("STORE01", "/j1/txt/1/f/i/stock", "/j1/txt/1/f/i/order", "Main Store");
            store.StorageModules.Add(hbwModule);
            factory.AddModule(store);
            store.factory = factory;

            return factory;
        }
    }
}
