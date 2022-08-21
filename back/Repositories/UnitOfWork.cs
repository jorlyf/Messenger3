using back.Contexts;
using back.Repositories.Interfaces;

namespace back.Repositories
{
	public class UnitOfWork : IDisposable
	{
		private DataContext Context { get; }
		public IUserRepository UserRepository { get; }
		public IPrivateDialogRepository PrivateDialogRepository { get; }
		public IGroupDialogRepository GroupDialogRepository { get; }
		public IMessageRepository MessageRepository { get; }
		public IAttachmentRepository AttachmentRepository { get; }

		public UnitOfWork(DataContext context)
		{
			this.Context = context;

			this.UserRepository = new UserRepository(this.Context);
			this.PrivateDialogRepository = new PrivateDialogRepository(this.Context);
			this.GroupDialogRepository = new GroupDialogRepository(this.Context);
			this.MessageRepository = new MessageRepository(this.Context);
			this.AttachmentRepository = new AttachmentRepository(this.Context);
		}

		public void Dispose()
		{
			this.Context.Dispose();
			GC.SuppressFinalize(this);
		}
	}
}
