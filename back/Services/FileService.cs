using back.Entities.Db.Message;
using back.Infrastructure;
using back.Entities.DTOs.Chat;

namespace back.Services
{
	public class FileService
	{
		#region MessageAttachments
		public async Task<IEnumerable<AttachmentModel>> SaveMessageAttachmentsAsync(IEnumerable<AttachmentDTO> attachments)
		{
			List<Task<AttachmentModel>> tasks = new();
			foreach (AttachmentDTO attachmentDTO in attachments)
			{
				tasks.Add(SaveMessageAttachmentAsync(attachmentDTO));
			}

			await Task.WhenAll(tasks);
			return tasks.Select(task => task.Result);
		}
		public Task<AttachmentModel> SaveMessageAttachmentAsync(AttachmentDTO attachment)
		{
			switch (attachment.Type)
			{
				case AttachmentTypes.Photo:
					return SavePhotoAttachmentAsync(attachment.FormFile);
				case AttachmentTypes.Video:
					return SaveVideoAttachmentAsync(attachment.FormFile);
				case AttachmentTypes.File:
					return SaveFileAttachmentAsync(attachment.FormFile);

				default:
					throw new ArgumentException("attachment type is not supported");
			}
		}

		private async Task<AttachmentModel> SavePhotoAttachmentAsync(IFormFile file)
		{
			string fileExtension = file.FileName.Split(".").Last();
			string savePath = Path.Combine(MessageAttachmentDirectories.Photo, GetRandomFilename(fileExtension));

			await SaveAsync(file, savePath);
			return new AttachmentModel
			{
				Type = AttachmentTypes.Photo,
				Url = GetUrl(savePath),
			};
		}
		private async Task<AttachmentModel> SaveVideoAttachmentAsync(IFormFile file)
		{
			string fileExtension = file.FileName.Split(".").Last();
			string savePath = Path.Combine(MessageAttachmentDirectories.Video, GetRandomFilename(fileExtension));

			await SaveAsync(file, savePath);
			return new AttachmentModel
			{
				Type = AttachmentTypes.Video,
				Url = GetUrl(savePath),
			};
		}
		private async Task<AttachmentModel> SaveFileAttachmentAsync(IFormFile file)
		{
			string fileExtension = file.FileName.Split(".").Last();
			string savePath = Path.Combine(MessageAttachmentDirectories.File, GetRandomFilename(fileExtension));

			await SaveAsync(file, savePath);
			return new AttachmentModel
			{
				Type = AttachmentTypes.File,
				Url = GetUrl(savePath),
			};
		}
		#endregion

		public async Task<string> SaveAvatar(IFormFile file)
		{
			string fileExtension = file.FileName.Split(".").Last();
			string avatarsPath = Path.Combine(Utils.UserDataPath, "Avatars");
			string savePath = Path.Combine(avatarsPath, GetRandomFilename(fileExtension));
			await SaveAsync(file, savePath);
			return GetUrl(savePath);
		}

		private async Task SaveAsync(IFormFile file, string path)
		{
			using (FileStream fs = new(path, FileMode.Create))
			{
				await file.CopyToAsync(fs);
				await fs.FlushAsync();
			}
		}

		private string GetRandomFilename(string extension)
		{
			return $"{Path.GetRandomFileName()}.{extension}";
		}

		private string GetUrl(string path)
		{
			int userDataIndex = path.IndexOf("UserData");
			return path.Substring(userDataIndex);
		}
	}

	public static class MessageAttachmentDirectories
	{
		private static string BaseFolder { get => Path.Combine(Utils.UserDataPath, "MessageAttachments"); }
		public static string Photo { get => Path.Combine(BaseFolder, "Photos"); }
		public static string Video { get => Path.Combine(BaseFolder, "Videos"); }
		public static string File { get => Path.Combine(BaseFolder, "Files"); }
	}
}
