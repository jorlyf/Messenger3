using back.Models;

namespace back.Repositories.Interfaces
{
	public interface IAsyncDialogRepository : IAsyncRepositoryBase<DialogModel>
	{
		public Task<IEnumerable<DialogModel?>> GetByNameAsync(string name);
		public Task<IEnumerable<DialogModel?>> GetByNameContainsAsync(string name);
	}
}
