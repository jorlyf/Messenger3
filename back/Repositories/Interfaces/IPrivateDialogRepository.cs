using back.Entities.Db.Dialog;

namespace back.Repositories.Interfaces
{
	public interface IPrivateDialogRepository : IRepositoryBase<PrivateDialogModel>
	{
		IQueryable<PrivateDialogModel> GetByUserId(int userId);
		IQueryable<PrivateDialogModel> GetByUserIds(int firstUserId, int secondUserId);
	}
}
