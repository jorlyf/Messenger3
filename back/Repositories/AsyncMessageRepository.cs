using back.Contexts;
using back.Models;
using back.Repositories.Interfaces;

namespace back.Repositories
{
	public class AsyncMessageRepository : AsyncRepositoryBase<MessageModel>, IAsyncMessageRepository
	{
		public AsyncMessageRepository(DataContext context) : base(context) { }


	}
}
