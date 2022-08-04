using back.Contexts;
using back.Entities.Db.Message;
using back.Repositories.Interfaces;

namespace back.Repositories
{
	public class AsyncAttachmentRepository : AsyncRepositoryBase<AttachmentModel>, IAsyncAttachmentRepository
	{
		public AsyncAttachmentRepository(DataContext context) : base(context) { }


	}
}
