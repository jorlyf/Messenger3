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
				.FirstOrDefaultAsync();
		}

		public Task<PrivateDialogModel?> GetByUsersAsync(UserModel firstUser, UserModel secondUser)
		{
			return GetByUserIdsAsync(firstUser.Id, secondUser.Id);
		}
	}
}
