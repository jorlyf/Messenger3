using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using back.Services;
using back.Models;
using back.Infrastructure;
using back.Infrastructure.Exceptions;
using back.Models.DTOs;
using back.Models.DTOs.Chat;

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

		[HttpPost]
		[Route("SendMessageToUser")]
		public async Task<ActionResult<MessageModel>> SendMessageToUserAsync(MessageContainerDTO messageContainerDTO)
		{
			try
			{
				int senderId = Utils.GetAuthorizedUserId(this.User);
				return Ok(await ChatService.SendMessageToUserAsync(senderId, messageContainerDTO));
			}
			catch (SendMessageException ex)
			{
				return BadRequest(ex.Reason);
			}
			catch (Exception)
			{
				return BadRequest(SendMessageExceptionReasons.UnexpectedError);
			}
		}

		//[HttpPost]
		//[Route("SendMessageToGroup")]
		//public async Task<ActionResult<MessageModel>> SendMessageToGroupAsync()
		//{

		//}

		[HttpGet]
		[Route("GetDialogs")]
		public async Task<ActionResult<DialogsDTO>> GetDialogsDTOAsync()
		{
			try
			{
				int senderId = Utils.GetAuthorizedUserId(this.User);
				return Ok(await this.ChatService.GetDialogsDTOAsync(senderId));
			}
			catch (Exception)
			{
				return BadRequest();
			}
		}

		[HttpGet]
		[Route("GetUsersByLoginContains")]
		public async Task<ActionResult<IEnumerable<UserModel>>> GetUsersByLoginContainsAsync(string login)
		{
			try
			{
				int senderId = Utils.GetAuthorizedUserId(this.User);
				return Ok(await this.ChatService.GetUsersByLoginContains(senderId, login));
			}
			catch (Exception)
			{
				return BadRequest();
			}
		}
	}
}
