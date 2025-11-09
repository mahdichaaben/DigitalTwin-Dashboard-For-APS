using backend_dash.Domain;
using backend_dash.WebApi.Dtos;

namespace backend_dash.WebApi.Mappers;

public static class UserMapper
{
    public static UserDto ToDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role,
            CreatedAt = user.CreatedAt
        };
    }
    public static List<UserDto> ToDtoList(IEnumerable<User> users)
    {
        return users.Select(u => ToDto(u)).ToList();
    }


}