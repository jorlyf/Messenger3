using back.Contexts;
using back.Entities.Db.Message;
using back.Repositories.Interfaces;

namespace back.Repositories
{
	public class AttachmentRepository : RepositoryBase<AttachmentModel>, IAttachmentRepository
	{
		public AttachmentRepository(DataContext context) : base(context) { }


	}
}
