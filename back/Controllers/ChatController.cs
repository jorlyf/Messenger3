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
			catch (ApiException ex)
			{
				return BadRequest(ex.Reason);
			}
			catch (Exception)
			{
				return StatusCode(500);
			}
		}

		[HttpGet]
		[Route("GetDialogs")]
		public async Task<ActionResult<DialogsDTO>> GetDialogsDTOAsync()
		{
			try
			{
				int senderId = Utils.GetAuthorizedUserId(this.User);
				return Ok(await this.ChatService.GetDialogsDTOAsync(senderId));
			}
			catch (ApiException ex)
			{
				return BadRequest(ex.Reason);
			}
			catch (Exception)
			{
				return StatusCode(500);
			}
		}

		[HttpGet]
		[Route("GetPrivateDialog")]
		public async Task<ActionResult<PrivateDialogDTO>> GetPrivateDialogAsync(int userId)
		{
			try
			{
				int senderId = Utils.GetAuthorizedUserId(this.User);
				PrivateDialogModel? dialogModel = await this.ChatService.GetPrivateDialogAsync(senderId, userId);
				if (dialogModel == null) { throw new ApiException(ApiExceptionReason.DialogIsNotFound); }

				PrivateDialogDTO dialogDTO = this.ChatService.PrivateDialogModelToDTO(dialogModel, userId);
				return Ok(dialogDTO);
			}
			catch (ApiException ex)
			{
				return BadRequest(ex.Reason);
			}
			catch (Exception)
			{
				return StatusCode(500);
			}
		}

		[HttpGet]
		[Route("GetGroupDialog")]
		public async Task<ActionResult<GroupDialogDTO>> GetGroupDialogAsync(int groupId)
		{
			try
			{
				GroupDialogModel? dialogModel = await this.ChatService.GetGroupDialogAsync(groupId);
				if (dialogModel == null) { throw new ApiException(ApiExceptionReason.DialogIsNotFound); }

				GroupDialogDTO dialogDTO = this.ChatService.GroupDialogModelToDTO(dialogModel);
				return Ok(dialogDTO);
			}
			catch (ApiException ex)
			{
				return BadRequest(ex.Reason);
			}
			catch (Exception)
			{
				return StatusCode(500);
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
			catch (ApiException ex)
			{
				return BadRequest(ex.Reason);
			}
			catch (Exception)
			{
				return StatusCode(500);
			}
		}
	}
}
