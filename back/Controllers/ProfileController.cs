﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using back.Services;
using back.Infrastructure;
using back.Infrastructure.Exceptions;
using back.Entities.Db.User;

namespace back.Controllers
{
	[Authorize]
	[ApiController]
	[Route("api/[controller]")]
	public class ProfileController : ControllerBase
	{
		private ProfileService ProfileService { get; }

		public ProfileController(ProfileService profileService)
		{
			this.ProfileService = profileService;
		}


		[HttpGet]
		[Route("LoadProfile")]
		public async Task<ActionResult<UserModel>> LoadProfileAsync()
		{
			try
			{
				int id = Utils.GetAuthorizedUserId(this.User);
				UserModel? user = await this.ProfileService.GetUserAsync(id);
				if (user == null) { throw new ApiException(ApiExceptionReason.UserIsNotFound); }

				return Ok(user);
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
		[Route("GetUser")]
		public async Task<ActionResult<UserModel>> GetUserAsync(int id)
		{
			try
			{
				UserModel? user = await this.ProfileService.GetUserAsync(id);
				if (user == null) { throw new ApiException(ApiExceptionReason.UserIsNotFound); }

				return Ok(user);
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
