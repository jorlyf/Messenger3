using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using back.Entities.Db.Dialog;
using back.Entities.DTOs.Chat;
using back.Infrastructure;
using back.Infrastructure.Exceptions;
using back.Services;

namespace back.Controllers
{
	[Authorize]
	[ApiController]
	[Route("api/[controller]")]
	public class MessageController : ControllerBase
	{
		private MessageService MessageService { get; }

		public MessageController(MessageService messageService)
		{
			MessageService = messageService;
		}


		[HttpPost]
		[Route("SendMessageToUser")]
		public async Task<ActionResult<MessageDTO>> SendMessageToUserAsync([FromForm] SendMessageContainerDTO messageContainerDTO)
		{
			try
			{
				int senderId = Utils.GetAuthorizedUserId(this.User);
				return Ok(await MessageService.SendMessageToUserAsync(senderId, messageContainerDTO));
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
		public async Task<ActionResult<MessageDTO>> SendMessageToGroupAsync([FromForm] SendMessageContainerDTO messageContainerDTO)
		{
			try
			{
				int senderId = Utils.GetAuthorizedUserId(this.User);
				return await this.MessageService.SendMessageToGroupAsync(senderId, messageContainerDTO);
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
		[Route("GetMoreDialogMessages")]
		public async Task<ActionResult<IEnumerable<MessageDTO>>> GetMoreDialogMessageDTOsAsync(int dialogId, DialogTypes dialogType, int oldestMessageId)
		{
			try
			{
				int limit = Constants.MessageCountGetLimit;
				IEnumerable<MessageDTO> messageDTOs = await this.MessageService.GetMoreDialogMessageDTOsAsync(dialogId, dialogType, oldestMessageId, limit);
				return Ok(messageDTOs);
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
