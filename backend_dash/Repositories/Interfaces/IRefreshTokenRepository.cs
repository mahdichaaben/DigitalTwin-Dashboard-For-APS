using backend_dash.Domain;

namespace backend_dash.Repositories
{
    public interface IRefreshTokenRepository
    {
        Task<RefreshToken?> GetByTokenAsync(string token);
        Task<List<RefreshToken>> GetActiveTokensForUserAsync(string userId);
        Task<List<RefreshToken>> GetByUserIdAsync(string userId); // for revoking all
        Task AddAsync(RefreshToken token);
        Task UpdateAsync(RefreshToken token);
        Task DeleteAsync(RefreshToken token);
        Task SaveChangesAsync();
    }
}
