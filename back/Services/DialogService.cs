using back.Entities.Db.Dialog;
using back.Entities.Db.Message;
using back.Entities.Db.User;
using back.Entities.DTOs.Chat;
using back.Infrastructure;
using back.Infrastructure.Exceptions;
using back.Repositories;

namespace back.Services
{
	public class DialogService
	{
		private AsyncUnitOfWork UoW { get; }

		public DialogService(AsyncUnitOfWork uow)
		{
			this.UoW = uow;
		}

		public async Task<DialogsDTO> GetDialogsDTOAsync(int responseSenderUserId)
		{
			Task<IEnumerable<PrivateDialogModel>> privateDialogs = this.UoW.PrivateDialogRepository.GetByUserId(responseSenderUserId);
			Task<IEnumerable<GroupDialogModel>> groupDialogs = this.UoW.GroupDialogRepository.GetByUserId(responseSenderUserId);

			await Task.WhenAll(privateDialogs, groupDialogs);

			IList<PrivateDialogDTO> privateDialogDTOs = new List<PrivateDialogDTO>();
			foreach (PrivateDialogModel dialog in privateDialogs.Result)
			{
				int id;
				if (dialog.FirstUserId != responseSenderUserId) { id = dialog.FirstUserId; }
				else { id = dialog.SecondUserId; }

				privateDialogDTOs.Add(PrivateDialogModelToDTO(dialog, id));
			}

			IList<GroupDialogDTO> groupDialogDTOs = new List<GroupDialogDTO>();
			foreach (GroupDialogModel dialog in groupDialogs.Result)
			{
				groupDialogDTOs.Add(GroupDialogModelToDTO(dialog));
			}

			return new DialogsDTO
			{
				PrivateDialogDTOs = privateDialogDTOs,
				GroupDialogDTOs = groupDialogDTOs
			};
		}

		public Task<PrivateDialogModel?> GetPrivateDialogAsync(int firstId, int secondId)
		{
			return this.UoW.PrivateDialogRepository.GetByUserIdsAsync(firstId, secondId);
		}

		public Task<GroupDialogModel?> GetGroupDialogAsync(int groupId)
		{
			return this.UoW.GroupDialogRepository.GetByIdAsync(groupId);
		}

		public PrivateDialogDTO PrivateDialogModelToDTO(PrivateDialogModel model, int userId)
		{
			if (userId != model.FirstUserId && userId != model.SecondUserId)
			{ throw new ArgumentException("bad create private dialog dto"); }

			string login;
			string? avatarUrl;
			if (userId == model.FirstUserId)
			{
				login = model.FirstUser.Login;
				avatarUrl = model.FirstUser.AvatarUrl;
			}
			else
			{
				login = model.SecondUser.Login;
				avatarUrl = model.SecondUser.AvatarUrl;
			}
			return new PrivateDialogDTO
			{
				UserId = userId,
				Messages = model.Messages.Select(x => new MessageDTO
				{
					SenderUser = x.SenderUser,
					Text = x.Text,
					Attachments = x.Attachments,
					SentAtTotalMilliseconds = Utils.GetTotalMilliseconds(x.SentAt)
				}),
				Name = login,
				UserAvatarUrl = avatarUrl,
				LastUpdateTotalMilliseconds = Utils.GetTotalMilliseconds(model.LastUpdate)
			};
		}

		public GroupDialogDTO GroupDialogModelToDTO(GroupDialogModel model)
		{
			return new GroupDialogDTO
			{
				GroupId = model.Id,
				UserIds = model.Users.Select(x => x.Id),
				Messages = model.Messages.Select(x => new MessageDTO
				{
					SenderUser = x.SenderUser,
					Text = x.Text,
					Attachments = x.Attachments,
					SentAtTotalMilliseconds = Utils.GetTotalMilliseconds(x.SentAt)
				}),
				Name = model.Name,
				GroupAvatarUrl = model.AvatarUrl,
				LastUpdateTotalMilliseconds = Utils.GetTotalMilliseconds(model.LastUpdate)
			};
		}

		public async Task<PrivateDialogModel> CreatePrivateDialogAsync(UserModel firstUser, UserModel secondUser)
		{
			if ((await this.UoW.PrivateDialogRepository.GetByUserIdsAsync(firstUser.Id, secondUser.Id)) != null)
			{
				throw new ApiException(ApiExceptionReason.PrivateDialogExists);
			}

			PrivateDialogModel dialog = new()
			{
				FirstUserId = firstUser.Id,
				SecondUserId = secondUser.Id,
				FirstUser = firstUser,
				SecondUser = secondUser,
				Messages = new List<MessageModel>(),
				LastUpdate = DateTime.Now,
			};
			await this.UoW.PrivateDialogRepository.AddAsync(dialog);
			await this.UoW.PrivateDialogRepository.SaveAsync();

			return dialog;
		}

		public async Task<GroupDialogModel> CreateGroupDialogAsync(IEnumerable<int> userIds)
		{
			List<Task<UserModel?>> usersTask = new();
			foreach (int id in userIds)
			{
				usersTask.Add(this.UoW.UserRepository.GetByIdAsync(id));
			}

			await Task.WhenAll(usersTask);

			foreach (UserModel? user in usersTask.Select(x => x.Result))
			{
				if (user == null) throw new ApiException(ApiExceptionReason.UserIsNotFound);
			}

			IEnumerable<UserModel> users = usersTask.Select(x => x.Result).ToList();
			string dialogName = "Чат " + string.Join(" ", users.Select(x => x.Login));
			int dialogNameLength = Math.Min(dialogName.Length, 30);
			dialogName = dialogName.Substring(0, dialogNameLength);

			GroupDialogModel dialog = new()
			{
				Users = users,
				Messages = new List<MessageModel>(),
				Name = dialogName,
				LastUpdate = DateTime.Now
			};

			await this.UoW.GroupDialogRepository.AddAsync(dialog);
			await this.UoW.GroupDialogRepository.SaveAsync();

			return dialog;
		}
	}
}
