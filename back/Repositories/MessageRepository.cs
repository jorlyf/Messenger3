using back.Contexts;
using back.Entities.Db.Message;
using back.Repositories.Interfaces;

namespace back.Repositories
{
	public class MessageRepository : RepositoryBase<MessageModel>, IMessageRepository
	{
		public MessageRepository(DataContext context) : base(context) { }


	}
}
