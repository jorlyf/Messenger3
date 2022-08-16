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
	public class DialogController : ControllerBase
	{
		private DialogService DialogService { get; }

		public DialogController(DialogService dialogService)
		{
			this.DialogService = dialogService;
		}


		[HttpPost]
		[Route("CreateGroupDialog")]
		public async Task<ActionResult<GroupDialogDTO>> CreateGroupDialogAsync([FromBody] GroupDialogCreatingDataDTO data)
		{
			try
			{
				GroupDialogModel model = await this.DialogService.CreateGroupDialogAsync(data.UserIds);
				GroupDialogDTO groupDialogDTO = this.DialogService.GroupDialogModelToDTO(model);
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
				return Ok(await this.DialogService.GetDialogsDTOAsync(senderId));
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
				PrivateDialogModel? dialogModel = await this.DialogService.GetPrivateDialogAsync(senderId, userId);
				if (dialogModel == null) { throw new ApiException(ApiExceptionReason.DialogIsNotFound); }

				PrivateDialogDTO dialogDTO = this.DialogService.PrivateDialogModelToDTO(dialogModel, userId);
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
				GroupDialogModel? dialogModel = await this.DialogService.GetGroupDialogAsync(groupId);
				if (dialogModel == null) { throw new ApiException(ApiExceptionReason.DialogIsNotFound); }

				GroupDialogDTO dialogDTO = this.DialogService.GroupDialogModelToDTO(dialogModel);
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
	}
}
