using back.Entities.Db.Dialog;

namespace back.Repositories.Interfaces
{
	public interface IAsyncGroupDialogRepository : IAsyncRepositoryBase<GroupDialogModel>
	{
		Task<IEnumerable<GroupDialogModel>> GetByNameAsync(string name);

		Task<IEnumerable<GroupDialogModel>> GetByNameContainsAsync(string name);

		Task<IEnumerable<GroupDialogModel>> GetByUserId(int userId);
	}
}
