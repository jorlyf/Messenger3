using back.Contexts;
using back.Repositories.Interfaces;

namespace back.Repositories
{
	public class AsyncUnitOfWork : IDisposable
	{
		private DataContext Context { get; }
		public IAsyncUserRepository UserRepository { get; }
		public IAsyncPrivateDialogRepository PrivateDialogRepository { get; }
		public IAsyncGroupDialogRepository GroupDialogRepository { get; }
		public IAsyncMessageRepository MessageRepository { get; }
		public IAsyncAttachmentRepository AttachmentRepository { get; }

		public AsyncUnitOfWork(DataContext context)
		{
			this.Context = context;

			this.UserRepository = new AsyncUserRepository(this.Context);
			this.PrivateDialogRepository = new AsyncPrivateDialogRepository(this.Context);
			this.GroupDialogRepository = new AsyncGroupDialogRepository(this.Context);
			this.MessageRepository = new AsyncMessageRepository(this.Context);
			this.AttachmentRepository = new AsyncAttachmentRepository(this.Context);
		}

		public void Dispose()
		{
			this.Context.Dispose();
			GC.SuppressFinalize(this);
		}
	}
}
