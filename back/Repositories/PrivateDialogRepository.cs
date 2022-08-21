using back.Contexts;
using back.Repositories.Interfaces;
using back.Entities.Db.Dialog;

namespace back.Repositories
{
	public class PrivateDialogRepository : RepositoryBase<PrivateDialogModel>, IPrivateDialogRepository
	{
		public PrivateDialogRepository(DataContext context) : base(context) { }

		public IQueryable<PrivateDialogModel> GetByUserIds(int firstUserId, int secondUserId)
		{
			return this.Set.Where(x =>
				(x.FirstUserId == firstUserId || x.FirstUserId == secondUserId)
				&&
				(x.SecondUserId == firstUserId || x.SecondUserId == secondUserId));
		}

		public IQueryable<PrivateDialogModel> GetByUserId(int userId)
		{
			return this.Set.Where(x => x.FirstUserId == userId || x.SecondUserId == userId);
		}
	}
}
