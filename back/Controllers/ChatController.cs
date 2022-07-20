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
		[Route("SearchDialogsByNameContains")]
		public async Task<ActionResult> SearchDialogsByNameContainsAsync(string name)
		{
			try
			{
				return Ok(await this.ChatService.SearchDialogsByNameContainsAsync(name));
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
		public async Task<ActionResult> SendMessageToGroupAsync(int groupId, [FromForm] MessageDTO message)
		{
			try
			{
				int senderId = Utils.GetAuthorizedUserId(this.User);
			}
			catch (Exception)
			{
				return BadRequest();
			}
			throw new NotImplementedException();
		}

		[HttpPost]
		[Route("SendMessageToUser")]
		public async Task<ActionResult> SendMessageToUserAsync(int userId, [FromForm] MessageDTO message)
		{
			try
			{
				int senderId = Utils.GetAuthorizedUserId(this.User);
				await this.ChatService.SendMessageToUserAsync(userId, message, senderId);
				return Ok();
			}
			catch (Exception)
			{
				return BadRequest();
			}
			throw new NotImplementedException();
		}

		[HttpGet]
		[Route("LoadDialogs")]
		public async Task<ActionResult<IEnumerable<DialogModel>>> LoadDialogsAsync()
		{
			try
			{
				int id = Utils.GetAuthorizedUserId(this.User);
			}
			catch (Exception)
			{
				return BadRequest();
			}
			throw new NotImplementedException();
		}
	}
}
