using backend_dash.Services;
using backend_dash.WebApi.Dtos;
using backend_dash.WebApi.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace backend_dash.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly OrderService _orderService;

        public OrderController(OrderService orderService)
        {
            _orderService = orderService;
        }

        // POST: api/order/store
        [HttpPost("AddWorkpieces")]
        public async Task<ActionResult<OrderDto>> AddStoreOrder([FromBody] CreateStoreOrderRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.RequestedBy) || request.WorkpieceIds == null || !request.WorkpieceIds.Any())
            {
                return BadRequest("RequestedBy and WorkpieceIds must be provided.");
            }

            try
            {
                var order = await _orderService.CreateStoreOrderAsync(
                    request.FactoryId,
                    request.RequestedBy,
                    request.WorkpieceIds
                );

                var orderDto = OrderMapper.ToDto(order);
                return CreatedAtAction(nameof(AddStoreOrder), new { id = order.Id }, orderDto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
        }

        // POST: api/order/store
        [HttpPost("production")]
        public async Task<ActionResult<OrderDto>> AddProductionOrder([FromBody] CreateProductionOrderRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.RequestedBy) || request.WorkpieceIds == null || !request.WorkpieceIds.Any())
            {
                return BadRequest("RequestedBy and WorkpieceIds must be provided.");
            }

            try
            {
                var order = await _orderService.CreateProductionOrderAsync(
                    request.FactoryId,
                    request.RequestedBy,
                    request.WorkpieceIds
                );

                var orderDto = OrderMapper.ToDto(order);
                return CreatedAtAction(nameof(AddProductionOrder), new { id = order.Id }, orderDto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
        }





        [HttpGet]
        public async Task<ActionResult<List<OrderDto>>> GetAllOrders()
        {
            var orders = await _orderService.GetAllOrdersAsync();
            return Ok(OrderMapper.ToDtoList(orders));
        }







        [HttpPost("RemoveWorkpieces")]
        public async Task<ActionResult<OrderDto>> AddUnstoreOrder([FromBody] CreateUnstoreOrderRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.RequestedBy) || request.WorkpieceIds == null || !request.WorkpieceIds.Any())
            {
                return BadRequest("RequestedBy and WorkpieceIds must be provided.");
            }

            try
            {
                var order = await _orderService.CreateUnstoreOrderAsync(
                    request.FactoryId,
                    request.RequestedBy,
                    request.WorkpieceIds
                );

                var orderDto = OrderMapper.ToDto(order);
                return CreatedAtAction(nameof(AddUnstoreOrder), new { id = order.Id }, orderDto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
        }


        // DTO for request
        public record CreateStoreOrderRequest(
            string FactoryId,
            string RequestedBy,
            List<string> WorkpieceIds
        );

        public record CreateProductionOrderRequest(

            string FactoryId,
            string RequestedBy,
            List<string> WorkpieceIds
            );



        public record CreateUnstoreOrderRequest(
        string FactoryId,
        string RequestedBy,
        List<string> WorkpieceIds
    );
    }
}