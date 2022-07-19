using back.Contexts;
using back.Repositories.Interfaces;

namespace back.Repositories
{
	public class AsyncUnitOfWork : IDisposable
	{
		private DataContext Context { get; }
		public IAsyncUserRepository UserRepository { get; }
		public IAsyncDialogRepository DialogRepository { get; }
		public IAsyncMessageRepository MessageRepository { get; }
		public IAsyncAttachmentRepository AttachmentRepository { get; }

		public AsyncUnitOfWork(DataContext context)
		{
			this.Context = context;

			this.UserRepository = new AsyncUserRepository(context);
			this.DialogRepository = new AsyncDialogRepository(context);
			this.MessageRepository = new AsyncMessageRepository(context);
			this.AttachmentRepository = new AsyncAttachmentRepository(context);
		}

		public void Dispose()
		{
			this.Context.Dispose();
			GC.SuppressFinalize(this);
		}
	}
}
