using back.Entities.Db.Message;
using back.Infrastructure;
using back.Entities.DTOs.Chat;

namespace back.Services
{
	public class FileService
	{
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
					return SavePhotoAsync(attachment.FormFile);
				case AttachmentTypes.Video:
					return SaveVideoAsync(attachment.FormFile);
				case AttachmentTypes.File:
					return SaveFileAsync(attachment.FormFile);

				default:
					throw new ArgumentException("attachment type is not supported");
			}
		}

		private async Task<AttachmentModel> SavePhotoAsync(IFormFile file)
		{
			string fileExtension = file.FileName.Split(".").Last();
			string savePath = Path.Combine(MessageAttachmentDirectories.Photo, GetRandomFilename(fileExtension));

			await SaveAsync(file, savePath);
			return new AttachmentModel
			{
				Type = AttachmentTypes.Photo,
				Url = savePath,
			};
		}
		private async Task<AttachmentModel> SaveVideoAsync(IFormFile file)
		{
			string fileExtension = file.FileName.Split(".").Last();
			string savePath = Path.Combine(MessageAttachmentDirectories.Video, GetRandomFilename(fileExtension));

			await SaveAsync(file, savePath);
			return new AttachmentModel
			{
				Type = AttachmentTypes.Video,
				Url = savePath,
			};
		}
		private async Task<AttachmentModel> SaveFileAsync(IFormFile file)
		{
			string fileExtension = file.FileName.Split(".").Last();
			string savePath = Path.Combine(MessageAttachmentDirectories.File, GetRandomFilename(fileExtension));

			await SaveAsync(file, savePath);
			return new AttachmentModel
			{
				Type = AttachmentTypes.File,
				Url = savePath,
			};
		}

		private Task SaveAsync(IFormFile file, string path)
		{
			using (FileStream fs = new(path, FileMode.Create))
			{
				return file.CopyToAsync(fs);
			}
		}

		private string GetRandomFilename(string extension)
		{
			return Path.Combine(Path.GetRandomFileName(), extension);
		}
	}

	public static class MessageAttachmentDirectories
	{
		private static string BaseFolder { get => Path.Combine(Utils.RootPath, "MessageAttachments"); }
		public static string Photo { get => Path.Combine(BaseFolder, "Photos"); }
		public static string Video { get => Path.Combine(BaseFolder, "Videos"); }
		public static string File { get => Path.Combine(BaseFolder, "Files"); }
	}
}
