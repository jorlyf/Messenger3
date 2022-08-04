using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using back.Services;
using back.Infrastructure;
using back.Infrastructure.Exceptions;
using back.Entities.DTOs.Chat;
using back.Entities.Db.User;
using back.Entities.Db.Dialog;

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
		public async Task<ActionResult<MessageDTO>> SendMessageToUserAsync([FromBody] SendMessageContainerDTO messageContainerDTO)
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
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return StatusCode(500);
			}
		}

		[HttpPost]
		[Route("SendMessageToGroup")]
		public async Task<ActionResult<MessageDTO>> SendMessageToGroupAsync([FromBody] SendMessageContainerDTO messageContainerDTO)
		{
			try
			{
				int senderId = Utils.GetAuthorizedUserId(this.User);
				return await this.ChatService.SendMessageToGroupAsync(senderId, messageContainerDTO);
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

		[HttpPost]
		[Route("CreateGroupDialog")]
		public async Task<ActionResult<GroupDialogDTO>> CreateGroupDialogAsync([FromBody] GroupDialogCreatingDataDTO data)
		{
			try
			{
				GroupDialogModel model = await this.ChatService.CreateGroupDialogAsync(data.UserIds);
				GroupDialogDTO groupDialogDTO = this.ChatService.GroupDialogModelToDTO(model);
				return Ok(groupDialogDTO);
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
		public async Task<ActionResult<PrivateDialogDTO>> GetPrivateDialogDTOAsync(int userId)
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
		public async Task<ActionResult<GroupDialogDTO>> GetGroupDialogDTOAsync(int groupId)
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
