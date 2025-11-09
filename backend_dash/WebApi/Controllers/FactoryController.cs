using backend_dash.Domain;
using backend_dash.WebApi.Dtos;
using backend_dash.WebApi.Mappers;
using Microsoft.AspNetCore.Mvc;

using backend_dash.Services;

namespace backend_dash.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FactoryController : ControllerBase
    {
        private readonly FactoryService _factoryService;

        public FactoryController(FactoryService factoryService)
        {
            _factoryService = factoryService;
        }

        // -----------------------------
        // Get the factory
        // -----------------------------
        [HttpGet]
        public ActionResult<FactoryDto> GetFactory()
        {
            var factory = _factoryService.GetFactory();
            return Ok(FactoryMapper.ToDto(factory));
        }

        // -----------------------------
        // Get all digital modules
        // -----------------------------
        [HttpGet("modules")]
        public ActionResult<List<ModuleDto>> GetAllDigitalModules()
        {
            var modules = _factoryService.GetAllDigitalModules();
            return Ok(FactoryMapper.ToModuleDtoList(modules));
        }

        // -----------------------------
        // Get digital module by SerialNumber
        // -----------------------------
        [HttpGet("modules/{serialNumber}")]
        public ActionResult<ModuleDto> GetDigitalModuleById(string serialNumber)
        {
            var module = _factoryService.GetDigitalModuleById(serialNumber);
            if (module == null) return NotFound();
            return Ok(FactoryMapper.ToDto(module));
        }


        [HttpGet("store")]
        public ActionResult<StoreDto> GetStore()
        {
            var store = _factoryService.GetStore();
            if (store == null) return NotFound();

            return Ok(StoreMapper.ToDto(store));
        }


    }
}
