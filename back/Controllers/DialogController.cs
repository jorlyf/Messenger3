﻿using Microsoft.AspNetCore.Authorization;
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
				GroupDialogDTO groupDialogDTO = this.DialogService.GroupDialogModelToDTO(model, model.Messages.Count);
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
		[Route("GetPrivateDialog")]
		public async Task<ActionResult<PrivateDialogDTO>> GetPrivateDialogDTOAsync(int userId)
		{
			try
			{
				int senderId = Utils.GetAuthorizedUserId(this.User);
				PrivateDialogDTO dialogDTO = await this.DialogService.GetPrivateDialogDTOAsync(senderId, userId);
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
				GroupDialogDTO dialogDTO = await this.DialogService.GetGroupDialogDTOAsync(groupId);
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

		[HttpPost]
		[Route("GetMoreDialogs")]
		public async Task<ActionResult<MoreDialogsAnswer>> GetMoreDialogsDTO([FromBody] MoreDialogsRequest moreDialogsRequest)
		{
			try
			{
				int senderId = Utils.GetAuthorizedUserId(this.User);
				MoreDialogsAnswer moreDialogsAnswer = await this.DialogService.GetMoreDialogsDTOAsync(senderId, moreDialogsRequest);
				return moreDialogsAnswer;
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
