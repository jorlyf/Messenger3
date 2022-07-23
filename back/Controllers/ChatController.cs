using back.Infrastructure;
using back.Models;
using back.Models.DTOs.Chat;
using back.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace back.Controllers
{
	[Authorize]
	[ApiController]
	[Route("api/[controller]")]
	public class ChatController : ControllerBase
	{
		private ChatService ChatService { get; }
		public ChatController(ChatService chatService)
		{
			this.ChatService = chatService;
		}

		[HttpGet]
		[Route("SearchGroupDialogsByNameContains")]
		public async Task<ActionResult<IEnumerable<GroupDialogDTO>>> SearchGroupDialogsByNameContainsAsync(string name)
		{
			try
			{
				return Ok(await this.ChatService.SearchGroupDialogsByNameContainsAsync(name));
			}
			catch (Exception)
			{
				return BadRequest();
			}
		}

		[HttpGet]
		[Route("SearchUsersByLoginContains")]
		public async Task<ActionResult<IEnumerable<UserModel>>> SearchUsersByLoginContainsAsync(string login)
		{
			try
			{
				return Ok(await this.ChatService.SearchUsersByLoginContainsAsync(login));
			}
			catch (Exception)
			{
				return BadRequest();
			}
		}

		[HttpPost]
		[Route("SendMessageToGroup")]
		public async Task<ActionResult<MessageModel>> SendMessageToGroupAsync(int groupId, [FromBody] MessageDTO message)
		{
			try
			{
				int senderId = Utils.GetAuthorizedUserId(this.User);
				throw new NotImplementedException();
			}
			catch (Exception)
			{
				return BadRequest();
			}
		}

		[HttpPost]
		[Route("SendMessageToUser")]
		public async Task<ActionResult<MessageModel>> SendMessageToUserAsync(int userId, [FromBody] MessageDTO message)
		{
			try
			{
				int senderId = Utils.GetAuthorizedUserId(this.User);
				MessageModel messageModel = await this.ChatService.SendMessageToUserAsync(userId, message, senderId);
				return Ok(messageModel);
			}
			catch (Exception)
			{
				return BadRequest();
			}
		}

		[HttpGet]
		[Route("LoadDialogs")]
		public async Task<ActionResult<IEnumerable<DialogsDTO>>> LoadDialogsAsync()
		{
			try
			{
				int id = Utils.GetAuthorizedUserId(this.User);
				throw new NotImplementedException();
			}
			catch (Exception)
			{
				return BadRequest();
			}
			throw new NotImplementedException();
		}

		[HttpGet]
		[Route("GetPrivateDialog")]
		public async Task<ActionResult<PrivateDialogModel?>> GetPrivateDialogAsync(int userId)
		{
			try
			{
				int senderId = Utils.GetAuthorizedUserId(this.User);
				PrivateDialogModel? dialog = await this.ChatService.SearchPrivateDialogByUserIds(userId, senderId);
				return dialog;
			}
			catch (Exception)
			{
				return BadRequest();
			}
		}
	}
}
