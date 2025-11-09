using backend_dash.Domain;
using backend_dash.Repositories;
using backend_dash.Services.Handlers;

namespace backend_dash.Services
{
    public class UserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        public async Task<User> CreateUserAsync(string username, string email, string role, string passwordHash)
        {
            // Generate GUID explicitly
            var userId = Guid.NewGuid().ToString();
            var user = new User(username, email, role, passwordHash, userId);

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            Console.WriteLine($"Created User: Id={user.Id}, Username={user.Username}"); // debug
            return user;
        }

        public async Task UpdatePasswordAsync(string userId, string currentPassword, string newPassword)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new Exception("User not found.");

            // Verify current password
            if (!PasswordHashHandler.VerifyPassword(currentPassword, user.PasswordHash))
                throw new Exception("Current password is incorrect.");

            // Hash new password and update
            var newPasswordHash = PasswordHashHandler.HashPassword(newPassword);
            user.UpdatePassword(newPasswordHash);

            await _userRepository.UpdateAsync(user);
            await _userRepository.SaveChangesAsync();
        }






        public async Task UpdateRoleAsync(string userId, string newRole)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new Exception("User not found.");

            user.UpdateRole(newRole);
            await _userRepository.UpdateAsync(user);
            await _userRepository.SaveChangesAsync();
        }

        // Get user by ID
        public async Task<User?> GetUserByIdAsync(string userId)
        {
            return await _userRepository.GetByIdAsync(userId);
        }

        // Get user by username
        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _userRepository.GetByUsernameAsync(username);
        }


        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _userRepository.GetByEmailAsync(email);
        }



        // Get all users
        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _userRepository.GetAllAsync();
        }

        // Delete user
        public async Task DeleteUserAsync(string userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new Exception("User not found.");

            await _userRepository.DeleteAsync(user);
            await _userRepository.SaveChangesAsync();
        }

    }
}
