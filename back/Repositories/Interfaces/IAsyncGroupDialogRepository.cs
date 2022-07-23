using back.Models;

namespace back.Repositories.Interfaces
{
	public interface IAsyncGroupDialogRepository : IAsyncRepositoryBase<GroupDialogModel>
	{
		Task<IEnumerable<GroupDialogModel>> GetByNameAsync(string name);

		Task<IEnumerable<GroupDialogModel>> GetByNameContainsAsync(string name);
	}
}
