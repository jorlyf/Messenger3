using back.Contexts;
using back.Repositories.Interfaces;
using back.Entities.Db.Dialog;

namespace back.Repositories
{
	public class GroupDialogRepository : RepositoryBase<GroupDialogModel>, IGroupDialogRepository
	{
		public GroupDialogRepository(DataContext context) : base(context) { }

		public IQueryable<GroupDialogModel> GetByName(string name)
		{
			return this.Set.Where(x => x.Name == name);
		}

		public IQueryable<GroupDialogModel> GetByNameContains(string name)
		{
			return this.Set.Where(x => x.Name.Contains(name));
		}

		public IQueryable<GroupDialogModel> GetByUserId(int userId)
		{
			return this.Set.Where(x => x.Users.Any(u => u.Id == userId));
		}
	}
}
