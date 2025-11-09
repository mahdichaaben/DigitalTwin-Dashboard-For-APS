using backend_dash.Domain;
using backend_dash.Domain.Events;
using backend_dash.Infrastructure.Data;
using backend_dash.Repositories;
using Microsoft.EntityFrameworkCore;
using System;

namespace backend_dash.Services;

public class WorkpieceService
{
    private readonly IWorkpieceRepository _workpieceRepo;
    private readonly IDigitalFactoryRepository _factoryRepo;

    private readonly WorkpieceEventHandler _wpEventHandler;


    public WorkpieceService(IWorkpieceRepository workpieceRepo, IDigitalFactoryRepository factoryRepo, WorkpieceEventHandler wpEventHandler)
    {
        _workpieceRepo = workpieceRepo;

        _factoryRepo = factoryRepo;
        _wpEventHandler = wpEventHandler;
    }


    public async Task<WorkpieceType> CreateWorkpieceTypeAsync(string id,string name, string color, List<string> modulesIds)
    {
        var wpType = new WorkpieceType(id,name, color);



        return wpType;
    }



    public async Task<WorkpieceType> ConfigureWorkpieceTypeAsync(string typeId, List<string> moduleIds)
    {

        return await _workpieceRepo.ConfigureWorkpieceTypeAsync(typeId, moduleIds);
    }


    public async Task<Workpiece> CreateWorkpieceAsync(string Id,string typeId, string addedBy)
    {

        var wpType = await _workpieceRepo.GetTypeByIdAsync(typeId);
        if (wpType == null)
            throw new InvalidOperationException($"WorkpieceType with ID '{typeId}' not found.");
        var wp = new Workpiece(Id, wpType, state: "FREE");


        _wpEventHandler.Subscribe(wp);

        await _workpieceRepo.AddAsync(wp);
        await _workpieceRepo.SaveChangesAsync();

        return wp;
    }

    public async Task<List<WorkpieceType>> GetAllWorkpieceTypesAsync()
    {
        return await _workpieceRepo.GetAllTypesAsync();
    }


    public async Task<List<Workpiece>> GetFreeWorkpiecesAsync()
    {
        return await _workpieceRepo.GetByStateAsync("FREE");
    }
    public async Task<List<Workpiece>> GetStoredWorkpiecesAsync()
    {
        return await _workpieceRepo.GetByStateAsync("STORED");
    }

    public async Task<List<Workpiece>> GetWorkpiecesAsync()
    {
        return await _workpieceRepo.GetAllAsync();
    }
}
