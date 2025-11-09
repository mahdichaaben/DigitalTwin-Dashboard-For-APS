// File: WebApi/Mappers/OrderMapper.cs
using backend_dash.Domain;
using backend_dash.WebApi.Dtos;

namespace backend_dash.WebApi.Mappers;
public static class OrderMapper
{
    public static OrderDto ToDto(Order order)
    {
        string orderType;

        if (order is ProductionOrder)
            orderType = "PRODUCTION";
        else if (order is StoreWorkpiecesOrder)
            orderType = "ADD TO STORE";
        else if (order is RetrieveWorkpiecesOrder)
            orderType = "RETRIEVE FROM STORE";
        else
            orderType = "UNKNOWN";

        return new OrderDto
        {
            Id = order.Id,
            Status = order.Status,
            RequestedBy = order.RequestedBy,
            CreatedAt = order.CreatedAt,
            //Workpieces = WorkpieceMapper.ToDtoList(order.Workpieces),
            OrderType = orderType
        };
    }



    public static List<OrderDto> ToDtoList(IEnumerable<Order> orders) =>
        orders.Select(ToDto).ToList();
}