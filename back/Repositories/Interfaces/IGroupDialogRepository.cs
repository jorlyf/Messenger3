using back.Entities.Db.Dialog;

namespace back.Repositories.Interfaces
{
	public interface IGroupDialogRepository : IRepositoryBase<GroupDialogModel>
	{
		IQueryable<GroupDialogModel> GetByUserId(int userId);
		IQueryable<GroupDialogModel> GetByName(string name);
		IQueryable<GroupDialogModel> GetByNameContains(string name);
	}
}
