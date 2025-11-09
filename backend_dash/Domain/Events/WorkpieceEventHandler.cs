using backend_dash.Repositories;
using backend_dash.Repositories;
using backend_dash.WebApi.Hubs;

namespace backend_dash.Domain.Events;



public class WorkpieceEventHandler
{
    private readonly DomainEventLogger _logger;

    public WorkpieceEventHandler(DomainEventLogger logger)
    {
        _logger = logger;
    }

    public void Subscribe(Workpiece wp)
    {
        wp.Subscribe(OnWorkpieceStateChanged);
    }

    private void OnWorkpieceStateChanged(Workpiece wp) { 


         Console.WriteLine($"[WorkpieceEventHandler] {wp.Id} state changed: {wp.State}");


        // 2️⃣ Persist log
        _logger.LogWorkpieceStateChange(wp);
    }
}
