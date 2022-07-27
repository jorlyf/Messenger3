using Microsoft.EntityFrameworkCore;
using back.Contexts;
using back.Models;
using back.Repositories.Interfaces;

namespace back.Repositories
{
	public class AsyncPrivateDialogRepository : AsyncRepositoryBase<PrivateDialogModel>, IAsyncPrivateDialogRepository
	{
		public AsyncPrivateDialogRepository(DataContext context) : base(context) { }

		public Task<PrivateDialogModel?> GetByUserIdsAsync(int firstUserId, int secondUserId)
		{
			return this.Set
				.Where(x =>
				(x.FirstUserId == firstUserId || x.FirstUserId == secondUserId)
				&&
				(x.SecondUserId == firstUserId || x.SecondUserId == secondUserId))
				.Include(x => x.FirstUser)
				.Include(x => x.SecondUser)
				.Include(x => x.Messages)
					.ThenInclude(x => x.SenderUser)
				.Include(x => x.Messages)
					.ThenInclude(x => x.Attachments)
				.FirstOrDefaultAsync();
		}

		public Task<PrivateDialogModel?> GetByUsersAsync(UserModel firstUser, UserModel secondUser)
		{
			return GetByUserIdsAsync(firstUser.Id, secondUser.Id);
		}

		public async Task<IEnumerable<PrivateDialogModel>> GetByUserId(int userId)
		{
			return await this.Set
				.Where(x => x.FirstUserId == userId || x.SecondUserId == userId)
				.Include(x => x.FirstUser)
				.Include(x => x.SecondUser)
				.Include(x => x.Messages)
					.ThenInclude(x => x.SenderUser)
				.Include(x => x.Messages)
					.ThenInclude(x => x.Attachments)
				.ToListAsync();
		}
	}
}
