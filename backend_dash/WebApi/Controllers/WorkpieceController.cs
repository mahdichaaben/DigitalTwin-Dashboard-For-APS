using backend_dash.Domain;
using backend_dash.Services;
using backend_dash.WebApi.Dtos;
using backend_dash.WebApi.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace backend_dash.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkpieceController : ControllerBase
    {
        private readonly WorkpieceService _workpieceService;
        private readonly FactoryService _factoryService;
        public WorkpieceController(WorkpieceService workpieceService, FactoryService factoryService)
        {
            _workpieceService = workpieceService;
            _factoryService = factoryService;
        }


        [HttpPost("types")]
        public async Task<ActionResult<WorkpieceTypeDto>> CreateWorkpieceType([FromBody] CreateTypeRequest request)
        {

            var type = await _workpieceService.CreateWorkpieceTypeAsync(request.Id,request.Name, request.Color, request.ModulesIds);
            return Ok(WorkpieceMapper.ToDto(type));
        }

        [HttpPut("types/{typeId}")]
        public async Task<ActionResult<WorkpieceTypeDto>> ConfigureWorkpieceType(string typeId, [FromBody] ConfigureTypeRequest request)
        {
            var type = await _workpieceService.ConfigureWorkpieceTypeAsync(typeId,request.ModulesIds);
            return Ok(WorkpieceMapper.ToDto(type));
        }

        [HttpPost]

        public async Task<ActionResult<WorkpieceDto>> CreateWorkpiece([FromBody] CreateWorkpieceRequest request)
        {
            try
            {
                var wp = await _workpieceService.CreateWorkpieceAsync(request.Id, request.TypeId, request.AddedBy);
                return Ok(WorkpieceMapper.ToDto(wp));
            }
            catch (InvalidOperationException ex) 
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex) 
            {
                return StatusCode(500, new { message = "An unexpected error occurred: " + ex.Message });
            }
        }





        [HttpGet("types")]
        public async Task<ActionResult<List<WorkpieceTypeDto>>> GetAllTypes()
        {
            var types = await _workpieceService.GetAllWorkpieceTypesAsync();
            return Ok(WorkpieceMapper.ToTypeDtoList(types));
        }



        [HttpGet("all")]
        public async Task<ActionResult<List<WorkpieceDto>>> GetAllWorkpieces()
        {

            var wps = await _workpieceService.GetWorkpiecesAsync();
            return Ok(WorkpieceMapper.ToDtoList(wps));


        }


    }

    public record CreateTypeRequest(string Id,string Name, string Color, List<string> ModulesIds);
    public record ConfigureTypeRequest(List<string> ModulesIds);
    public record CreateWorkpieceRequest(string Id, string TypeId, string AddedBy);
}
