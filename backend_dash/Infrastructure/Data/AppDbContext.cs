using backend_dash.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Reflection.Emit;

namespace backend_dash.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }



    public DbSet<DigitalFactory> DigitalFactories { get; set; }
    public DbSet<DigitalModule> DigitalModules { get; set; }
    public DbSet<FixedModule> FixedModules { get; set; }

    public DbSet<StorageModule> StorageModules { get; set; }
    public DbSet<TransportModule> TransportModules { get; set; }
    public DbSet<Store> Stores { get; set; }

    public DbSet<WorkpieceTypeModule> WorkpieceTypeModules { get; set; }
    public DbSet<Order> Orders { get; set; }
    // public DbSet<Command> Commands { get; set; }


    public DbSet<Workpiece> Workpieces { get; set; }
    public DbSet<WorkpieceType> WorkpieceTypes { get; set; }



    public DbSet<WorkpieceLog> WorkpieceLogs { get; set; } = default!;


    public DbSet<ModuleLog> ModuleLogs { get; set; }

    public DbSet<TaskFixedModule> TaskFixedModules { get; set; }



    public DbSet<User> Users { get; set; } = default!;
    public DbSet<RefreshToken> RefreshTokens { get; set; } = default!;
    public DbSet<UserAccess> UserAccesses { get; set; } = default!;


    public DbSet<Sensor> Sensors { get; set; } = default!;
    public DbSet<SensorLog> SensorLogs { get; set; } = default!;


    public DbSet<AlertEntity> Alerts { get; set; } = default!;



    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);


        modelBuilder.Ignore<Command>();

        modelBuilder.Ignore<Order>();

        ConfigureDigitalFactory(modelBuilder);
        ConfigureDigitalModules(modelBuilder);
        ConfigureFixedModules(modelBuilder);

        ConfigureTaskFixedModules(modelBuilder);


        ConfigureStorageModules(modelBuilder);
        ConfigureTransportModules(modelBuilder);
        ConfigureStores(modelBuilder);


        ConfigureOrders(modelBuilder);
        //   ConfigureCommands(modelBuilder);

        ConfigureWorkpieceTypeModules(modelBuilder);

        ConfigureWorkpieceTypes(modelBuilder);
        ConfigureWorkpieces(modelBuilder);



        ConfigureWorkpieceLogs(modelBuilder);
        ConfigureModuleLogs(modelBuilder);


        ConfigureStorageSlots(modelBuilder);


        ConfigureUsers(modelBuilder);



        ConfigureSensors(modelBuilder);
        ConfigureSensorLogs(modelBuilder);

        // Add AlertEntity configuration
        ConfigureAlerts(modelBuilder);
    }



    private void ConfigureDigitalFactory(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<DigitalFactory>(entity =>
        {
            entity.ToTable("DigitalFactories");

            entity.HasKey(e => e.Ref);

            entity.Property(e => e.Ref);

            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .IsRequired(false);


            entity.HasMany(f => f.DigitalModules)
                .WithOne(m => m.factory)
                .HasForeignKey("FactoryId")
                .OnDelete(DeleteBehavior.Cascade);

            entity.Ignore(e => e.TransportModules);
            entity.Ignore(e => e.FixedModulesList);
            entity.Ignore(e => e.MainStore);
            entity.Ignore(e => e.Orders);
        });
    }

    private void ConfigureDigitalModules(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<DigitalModule>(entity =>
        {
            entity.ToTable("DigitalModules");

            entity.HasKey(e => e.SerialNumber);

            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(e => e.TopicState)
                .HasMaxLength(500)
                .IsRequired();

            entity.Property(e => e.TopicCommand)
                .HasMaxLength(500)
                .IsRequired();

            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValue("FINISHED")
                .IsRequired();

            entity.Property(e => e.ComponentState)
                .HasMaxLength(255);

            entity.Ignore(e => e.CurrentAction);
            entity.Ignore(e => e.ActionHistory);

            entity.HasOne(m => m.factory)                  // navigation property
                  .WithMany(f => f.DigitalModules)        // collection in factory
                  .HasForeignKey("FactoryId")             // FK column name
                  .OnDelete(DeleteBehavior.Cascade);      // cascade behavior


            entity.Ignore(e => e.CurrentWorkpieces);

        });
    }



    private void ConfigureFixedModules(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<FixedModule>(entity =>
        {
            entity.ToTable("FixedModules");

            entity.HasBaseType<DigitalModule>();

            entity.Property(e => e.Position)
                .HasMaxLength(255)
                .IsRequired();

            entity.HasMany(e => e.Proces)
                .WithOne()
                .HasForeignKey("FixedModuleId")
                .OnDelete(DeleteBehavior.Cascade);
        });
    }


    private void ConfigureTaskFixedModules(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TaskFixedModule>(entity =>
        {
            entity.ToTable("TaskFixedModules");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                  .HasMaxLength(100)
                  .IsRequired();

            entity.Property(e => e.Name)
                  .HasMaxLength(255)
                  .IsRequired();

            entity.Property(e => e.Order)
                  .IsRequired();

            entity.HasOne(e => e.FixedModule)
                  .WithMany(fm => fm.Proces)
                  .HasForeignKey("FixedModuleId")
                  .IsRequired()
                  .OnDelete(DeleteBehavior.Cascade); // cascade delete
        });
    }



    private void ConfigureOrders(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Order>(entity =>
        {
            entity.ToTable("Orders");
            entity.HasKey(o => o.Id);
            entity.Property(o => o.Status).HasMaxLength(50).IsRequired();
            entity.Property(o => o.RequestedBy).HasMaxLength(255);

            //entity.HasMany(o => o.Commands)
            //      .WithOne(c => c.Order)
            //      .HasForeignKey("OrderId")
            //      .OnDelete(DeleteBehavior.Cascade);

            entity.HasDiscriminator<string>("OrderType")
                  .HasValue<ProductionOrder>("PRODUCTION")
                  .HasValue<StoreWorkpiecesOrder>("ADD TO STORE")
                  .HasValue<RetrieveWorkpiecesOrder>("RETRIEVE FROM STORE");

            entity.Ignore(e => e.Workpieces);

            entity.Ignore(e => e.Factory);

            entity.Ignore(e => e.Commands);

            //entity.Ignore(e => e.Status);

        });

    }
    private void ConfigureCommands(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Command>(entity =>
        {
            entity.ToTable("Commands");
            entity.HasKey(c => c.Id);

            entity.Property(c => c.CommandName)
                  .HasMaxLength(255)
                  .IsRequired();

            entity.Property(c => c.Status)
                  .HasMaxLength(50)
                  .IsRequired();


            entity.HasOne(c => c.Order)
                  .WithMany(o => o.Commands)
                  .HasForeignKey(c => c.OrderId)
                  .IsRequired(false) // optional FK
                  .OnDelete(DeleteBehavior.Cascade);


            entity.HasDiscriminator<string>("CommandType")
      .HasValue<StoreCommand>("STORE")
      .HasValue<TaskCommand>("TASK")
      .HasValue<TransportCommand>("TRANSPORT");




            entity.Ignore(c => c.Metadata);
            entity.Ignore(c => c.Module);
        });
    }

    private void ConfigureWorkpieceTypes(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<WorkpieceType>(entity =>
        {
            entity.ToTable("WorkpieceTypes");
            entity.HasKey(wt => wt.Id);

            entity.Property(wt => wt.Name)
                  .HasMaxLength(255)
                  .IsRequired();

            entity.Property(wt => wt.Color)
                  .HasMaxLength(100)
                  .IsRequired();

            // One-to-many relationship with Workpieces
            entity.HasMany(wt => wt.Workpieces)
                  .WithOne(w => w.Type)
                  .HasForeignKey("TypeId")
                  .IsRequired()
                  .OnDelete(DeleteBehavior.Restrict);

            // Navigation for join entity
            entity.HasMany(wt => wt.ModuleLinks)
                  .WithOne(l => l.WorkpieceType)
                  .HasForeignKey(l => l.WorkpieceTypeId)
                  .OnDelete(DeleteBehavior.Cascade);
        });



    }



    private void ConfigureWorkpieceTypeModules(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<WorkpieceTypeModule>(entity =>
        {
            entity.ToTable("WorkpieceTypeModules");

            entity.HasKey(wtm => new { wtm.WorkpieceTypeId, wtm.FixedModuleId }); // composite key

            entity.Property(wtm => wtm.Order)
                  .HasDefaultValue(0)
                  .IsRequired();

            entity.HasOne(wtm => wtm.WorkpieceType)
                  .WithMany(wt => wt.ModuleLinks)
                  .HasForeignKey(wtm => wtm.WorkpieceTypeId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(wtm => wtm.FixedModule)
                  .WithMany(fm => fm.CompatibleWorkpieceTypesLinks)
                  .HasForeignKey(wtm => wtm.FixedModuleId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }


    private void ConfigureWorkpieces(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Workpiece>(entity =>
        {
            entity.ToTable("Workpieces");
            entity.HasKey(w => w.Id);

            entity.Property(w => w.State)
                  .HasMaxLength(100)
                  .HasDefaultValue("FREE")
                  .IsRequired();



            // FIX: Properly configure the relationship with WorkpieceType
            entity.HasOne(w => w.Type)
                  .WithMany(wt => wt.Workpieces)
                  .HasForeignKey(w => w.TypeId)
                  .IsRequired()
                  .OnDelete(DeleteBehavior.Restrict);

            //entity.HasOne(w => w.Order)
            //      .WithMany(o => o.Workpieces)
            //      .HasForeignKey(w => w.OrderId) 
            //      .IsRequired(false)
            //      .OnDelete(DeleteBehavior.SetNull);

            entity.Ignore(w => w.Order);
            entity.Ignore(e => e.LastProcessedModule);

            // entity.Ignore(e => e.State);
        });
    }

    private void ConfigureStorageModules(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<StorageModule>(entity =>
        {
            entity.ToTable("StorageModules");

            entity.HasBaseType<FixedModule>();

            entity.Property(e => e.Capacity)
                .HasDefaultValue(0)
                .IsRequired();

            entity.Ignore(e => e.StoredWorkpieces);
        });
    }

    private void ConfigureTransportModules(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TransportModule>(entity =>
        {
            entity.ToTable("TransportModules");

            entity.HasBaseType<DigitalModule>();

            entity.Property(e => e.CurrentPosition)
                .HasMaxLength(255)
                .HasDefaultValue("")
                .IsRequired();
        });
    }

    private void ConfigureStores(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Store>(entity =>
        {
            entity.ToTable("Stores");

            entity.HasBaseType<DigitalModule>();

            entity.HasMany(e => e.StorageModules)
                .WithOne()
                .HasForeignKey("StoreId")
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private void ConfigureWorkpieceLogs(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<WorkpieceLog>(entity =>
        {
            entity.ToTable("WorkpieceLogs");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.WorkpieceId)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(e => e.WorkpieceType)
                  .HasMaxLength(255)
                  .IsRequired(false);

            entity.Property(e => e.State)
                  .HasMaxLength(50)
                  .IsRequired();

            entity.Property(e => e.ModuleSerial)
                  .HasMaxLength(100)
                  .IsRequired(false);

            entity.Property(e => e.OrderId)
                  .HasMaxLength(100)
                  .IsRequired(false);

            entity.Property(e => e.Timestamp)
                  .IsRequired();

            entity.HasOne<Workpiece>()
                  .WithMany()                           // Workpiece doesn't have collection for logs
                  .HasForeignKey(e => e.WorkpieceId)
                  .HasConstraintName("FK_WorkpieceLogs_Workpiece")
                  .OnDelete(DeleteBehavior.Restrict);   // avoid cascading delete

            entity.HasOne<Order>()                      // no navigation property needed
                  .WithMany()
                  .HasForeignKey(e => e.OrderId)
                  .HasConstraintName("FK_WorkpieceLogs_Order")
                  .OnDelete(DeleteBehavior.SetNull);
        });
    }




    private void ConfigureStorageSlots(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<StorageSlot>(entity =>
        {
            entity.ToTable("StorageSlots");
            entity.HasKey(s => s.Id);

            entity.Property(s => s.SlotName)
                  .HasMaxLength(10)
                  .IsRequired();

            //entity.HasOne(s => s.Workpiece)
            //      .WithMany()                 // Workpiece does not need to know its slot
            //      .HasForeignKey("WorkpieceId")
            //      .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(s => s.StorageModule)
                  .WithMany(sm => sm.Slots)
                  .HasForeignKey(s => s.StorageModuleId)
                  .IsRequired()
                  .OnDelete(DeleteBehavior.Cascade);


            entity.Ignore(e => e.Workpiece);
        });
    }


    private void ConfigureModuleLogs(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ModuleLog>(entity =>
        {
            entity.ToTable("ModuleLogs");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.ModuleSerialNumber)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(e => e.ModuleName)
                  .HasMaxLength(255)
                  .IsRequired(false);

            entity.Property(e => e.ModuleState)
      .HasMaxLength(255)
      .IsRequired(false);


            entity.Property(e => e.Status)
                  .HasMaxLength(50)
                  .IsRequired(false);

            entity.Property(e => e.CommandName)
                  .HasMaxLength(255)
                  .IsRequired(false);

            entity.Property(e => e.wpId)
      .HasMaxLength(100)
      .IsRequired(false);

            entity.Property(e => e.Timestamp)
                  .IsRequired();
        });
    }





    public override int SaveChanges()
    {
        return base.SaveChanges();
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await base.SaveChangesAsync(cancellationToken);
    }


    private void ConfigureUsers(ModelBuilder modelBuilder)
    {
        // ------------------ User ------------------
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");

            entity.HasKey(u => u.Id);

            entity.Property(u => u.Username)
                  .HasMaxLength(255)
                  .IsRequired();

            entity.Property(u => u.Email)
                  .HasMaxLength(255)
                  .IsRequired();

            entity.Property(u => u.Role)
                  .HasMaxLength(50)
                  .IsRequired();

            entity.Property(u => u.PasswordHash)
                  .HasMaxLength(500)
                  .IsRequired();

            entity.Property(u => u.CreatedAt)
                  .IsRequired();

            // One-to-many: User → RefreshTokens
            entity.HasMany(u => u.RefreshTokens)
                  .WithOne(rt => rt.User)
                  .HasForeignKey(rt => rt.UserAccountId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ------------------ RefreshToken ------------------
        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.ToTable("RefreshTokens");

            entity.HasKey(rt => rt.Id);

            entity.Property(rt => rt.Token)
                  .HasMaxLength(500)
                  .IsRequired();

            entity.Property(rt => rt.Expires)
                  .IsRequired();

            entity.Property(rt => rt.Created)
                  .IsRequired();

            entity.Property(rt => rt.Revoked);

            entity.Property(rt => rt.ReplacedByToken)
                  .HasMaxLength(500);


            entity.Property(rt => rt.OriginId)
      .HasMaxLength(100);



            entity.HasOne(rt => rt.User)
                  .WithMany(u => u.RefreshTokens)
                  .HasForeignKey(rt => rt.UserAccountId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ------------------ UserAccess ------------------
        modelBuilder.Entity<UserAccess>(entity =>
        {
            entity.ToTable("UserAccesses");

            // Composite key using scalar FK properties
            entity.HasKey(ua => new { ua.UserId, ua.FactoryId });

            entity.Property(ua => ua.HasAccess)
                  .IsRequired();

            entity.Property(ua => ua.CreatedAt)
                  .IsRequired();

            // FK → User
            entity.HasOne(ua => ua.User)
                  .WithMany() // optionally: .WithMany(u => u.UserAccesses) if you track them
                  .HasForeignKey(ua => ua.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            // FK → Factory
            entity.HasOne(ua => ua.Factory)
                  .WithMany() // optionally: .WithMany(f => f.UserAccesses)
                  .HasForeignKey(ua => ua.FactoryId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }








    private void ConfigureSensors(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Sensor>(entity =>
        {
            entity.ToTable("Sensors");

            entity.HasKey(s => s.SensorId);

            entity.Property(s => s.Name)
                  .HasMaxLength(255)
                  .IsRequired();

            entity.Property(s => s.SensorType)
                  .HasMaxLength(100)
                  .IsRequired();

            entity.Property(s => s.Description)
                  .HasMaxLength(500)
                  .IsRequired(false);

            entity.Property(s => s.Unit)
                  .HasMaxLength(50)
                  .IsRequired(false);

            entity.Property(s => s.MinValue)
                  .IsRequired(false);

            entity.Property(s => s.MaxValue)
                  .IsRequired(false);

            entity.Property(s => s.LastUpdate)
                  .IsRequired();

            entity.Property(s => s.IsActive)
                  .HasDefaultValue(true)
                  .IsRequired();

            // Relationship with DigitalModule (optional)
            entity.HasOne(s => s.DigitalModule)
                  .WithMany()
                  .HasForeignKey("DigitalModuleId")
                  .OnDelete(DeleteBehavior.Cascade);

            // Relationship with SensorLogs
            entity.HasMany(s => s.Logs)
                  .WithOne()
                  .HasForeignKey(sl => sl.SensorId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private void ConfigureSensorLogs(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<SensorLog>(entity =>
        {
            entity.ToTable("SensorLogs");

            // Composite primary key: SensorId + Timestamp
            entity.HasKey(sl => new { sl.SensorId, sl.Timestamp });

            entity.Property(sl => sl.ValueRaw)
                  .HasMaxLength(500)
                  .IsRequired();

            entity.Property(sl => sl.ValueNumeric)
                  .IsRequired(false);

            entity.Property(sl => sl.Timestamp)
                  .IsRequired();
        });
    }


    private void ConfigureAlerts(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AlertEntity>(entity =>
        {
            entity.ToTable("Alerts");

            entity.HasKey(a => a.AlertId);

            entity.Property(a => a.AlertId)
                  .HasMaxLength(100)
                  .IsRequired();

            entity.Property(a => a.DigitalModuleId)
                  .HasMaxLength(100)
                  .IsRequired(false);

            entity.Property(a => a.AlertType)
                  .HasMaxLength(100)
                  .IsRequired(false);

            entity.Property(a => a.SensorId)
                  .HasMaxLength(100)
                  .IsRequired(false);

            entity.Property(a => a.Description)
                  .HasMaxLength(500)
                  .IsRequired(false);

            entity.Property(a => a.Summary)
                  .HasMaxLength(255)
                  .IsRequired(false);

            entity.Property(a => a.Status)
                  .HasMaxLength(50)
                  .IsRequired();

            entity.Property(a => a.StartedAt)
                  .HasMaxLength(50)
                  .IsRequired(false); // Now string

            entity.Property(a => a.EndedAt)
                  .HasMaxLength(50)
                  .IsRequired(false); // Now string
        });
    }






}
// Extension class for additional configuration
public static class ModelBuilderExtensions
{
    public static void ConfigureDigitalFactoryDomain(this ModelBuilder modelBuilder)
    {
        // Additional domain-specific configurations can go here

        // Configure value objects, complex types, etc.
        // Example: Configure events, commands, etc.
    }
}
