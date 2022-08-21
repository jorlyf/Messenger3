using Microsoft.EntityFrameworkCore;
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
		private UnitOfWork UoW { get; }

		public DialogService(UnitOfWork uow)
		{
			this.UoW = uow;
		}

		public async Task<PrivateDialogDTO> GetPrivateDialogDTOAsync(int senderUserId, int secondUserId)
		{
			PrivateDialogModel? dialogModel = await this.UoW.PrivateDialogRepository
				.GetByUserIds(senderUserId, secondUserId)
				.AsNoTracking()
				.Include(x => x.FirstUser)
				.Include(x => x.SecondUser)
				.Include(x => x.Messages)
					.ThenInclude(x => x.Attachments)
				.Include(x => x.Messages)
					.ThenInclude(x => x.SenderUser)
				.FirstOrDefaultAsync();
			if (dialogModel == null) { throw new ApiException(ApiExceptionReason.DialogIsNotFound); }

			int totalMessagesCount = dialogModel.Messages.Count;
			dialogModel.Messages = dialogModel.Messages.OrderBy(x => x.Id).TakeLast(Constants.MessageCountGetLimit).ToList();

			PrivateDialogDTO dialogDTO = PrivateDialogModelToDTO(dialogModel, secondUserId, totalMessagesCount);
			return dialogDTO;
		}

		public async Task<GroupDialogDTO> GetGroupDialogDTOAsync(int id)
		{
			GroupDialogModel? dialogModel = await this.UoW.GroupDialogRepository
				.GetById(id)
				.AsNoTracking()
				.Include(x => x.Users)
				.Include(x => x.Messages)
					.ThenInclude(x => x.Attachments)
				.Include(x => x.Messages)
					.ThenInclude(x => x.SenderUser)
				.FirstOrDefaultAsync();
			if (dialogModel == null) { throw new ApiException(ApiExceptionReason.DialogIsNotFound); }

			int totalMessagesCount = dialogModel.Messages.Count;
			dialogModel.Messages = dialogModel.Messages.OrderBy(x => x.Id).TakeLast(Constants.MessageCountGetLimit).ToList();

			GroupDialogDTO dialogDTO = GroupDialogModelToDTO(dialogModel, totalMessagesCount);
			return dialogDTO;
		}

		public async Task<MoreDialogsAnswer> GetMoreDialogsDTOAsync(int senderUserId, MoreDialogsRequest moreDialogsRequest)
		{
			Task<List<PrivateDialogModel>> privateDialogsTask = this.UoW.PrivateDialogRepository
				.GetByUserId(senderUserId)
				.AsNoTracking()
				.Include(x => x.FirstUser)
				.Include(x => x.SecondUser)
				.Include(x => x.Messages)
					.ThenInclude(x => x.Attachments)
				.Include(x => x.Messages)
					.ThenInclude(x => x.SenderUser)
				.ToListAsync();

			Task<List<GroupDialogModel>> groupDialogsTask = this.UoW.GroupDialogRepository
				.GetByUserId(senderUserId)
				.AsNoTracking()
				.Include(x => x.Users)
				.Include(x => x.Messages)
					.ThenInclude(x => x.Attachments)
				.Include(x => x.Messages)
					.ThenInclude(x => x.SenderUser)
				.ToListAsync();

			await Task.WhenAll(privateDialogsTask, groupDialogsTask);

			int totalDialogCount = privateDialogsTask.Result.Count + groupDialogsTask.Result.Count;

			List<DialogBaseModel> newBaseDialogModels = new();
			foreach (PrivateDialogModel dialog in privateDialogsTask.Result)
			{
				if (!moreDialogsRequest.ExistingDialogs.Any(exist => dialog.Id == exist.Id && DialogTypes.Private == exist.Type))
					newBaseDialogModels.Add(dialog);
			}
			foreach (GroupDialogModel dialog in groupDialogsTask.Result)
			{
				if (!moreDialogsRequest.ExistingDialogs.Any(exist => dialog.Id == exist.Id && DialogTypes.Group == exist.Type))
					newBaseDialogModels.Add(dialog);
			}
			IEnumerable<DialogBaseModel> limitedBaseDialogModels = newBaseDialogModels
				.OrderBy(x => x.LastUpdate)
				.TakeLast(Constants.DialogCountGetLimit);


			List<PrivateDialogDTO> privateDialogDTOs = new();
			List<GroupDialogDTO> groupDialogDTOs = new();

			foreach (DialogBaseModel model in limitedBaseDialogModels)
			{
				int totalMessageCount = model.Messages.Count;
				model.Messages = model.Messages.OrderBy(x => x.Id).TakeLast(Constants.MessageCountGetLimit).ToList();
				if (model is PrivateDialogModel privateDialog)
				{
					int id;
					if (privateDialog.FirstUserId != senderUserId) { id = privateDialog.FirstUserId; }
					else { id = privateDialog.SecondUserId; }

					privateDialogDTOs.Add(PrivateDialogModelToDTO(privateDialog, id, totalMessageCount));
				}
				else if (model is GroupDialogModel groupdDialog)
				{
					groupDialogDTOs.Add(GroupDialogModelToDTO(groupdDialog, totalMessageCount));
				}
			}


			return new MoreDialogsAnswer
			{
				DialogsDTO = new DialogsDTO
				{
					PrivateDialogDTOs = privateDialogDTOs,
					GroupDialogDTOs = groupDialogDTOs
				},
				TotalDialogCount = totalDialogCount
			};
		}

		public PrivateDialogDTO PrivateDialogModelToDTO(PrivateDialogModel model, int userId, int totalMessagesCount)
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
				Messages = model.Messages.Select(x => MessageService.MessageModelToDTO(x)),
				TotalMessagesCount = totalMessagesCount,
				Name = login,
				UserAvatarUrl = avatarUrl,
				LastUpdateTotalMilliseconds = Utils.GetTotalMilliseconds(model.LastUpdate)
			};
		}

		public GroupDialogDTO GroupDialogModelToDTO(GroupDialogModel model, int totalMessagesCount)
		{
			return new GroupDialogDTO
			{
				GroupId = model.Id,
				UserIds = model.Users.Select(x => x.Id),
				Messages = model.Messages.Select(x => MessageService.MessageModelToDTO(x)),
				TotalMessagesCount = totalMessagesCount,
				Name = model.Name,
				GroupAvatarUrl = model.AvatarUrl,
				LastUpdateTotalMilliseconds = Utils.GetTotalMilliseconds(model.LastUpdate)
			};
		}

		public async Task<PrivateDialogModel> CreatePrivateDialogAsync(UserModel firstUser, UserModel secondUser)
		{
			if ((await this.UoW.PrivateDialogRepository.GetByUserIds(firstUser.Id, secondUser.Id).FirstOrDefaultAsync()) != null)
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
				usersTask.Add(this.UoW.UserRepository.GetById(id).FirstOrDefaultAsync());
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
