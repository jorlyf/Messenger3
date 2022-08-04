﻿using back.Entities.Db.Dialog;
using back.Entities.Db.User;

namespace back.Repositories.Interfaces
{
	public interface IAsyncPrivateDialogRepository : IAsyncRepositoryBase<PrivateDialogModel>
	{
		Task<PrivateDialogModel?> GetByUserIdsAsync(int firstUserId, int secondUserId);
		Task<PrivateDialogModel?> GetByUsersAsync(UserModel firstUser, UserModel secondUser);

		Task<IEnumerable<PrivateDialogModel>> GetByUserId(int userId);
	}
}
