using Microsoft.AspNetCore.Authorization;
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
		private UserService UserService { get; }

		public ProfileController(ProfileService profileService, UserService userService)
		{
			this.ProfileService = profileService;
			this.UserService = userService;
		}


		[HttpGet]
		[Route("LoadProfile")]
		public async Task<ActionResult<UserModel>> LoadProfileAsync()
		{
			try
			{
				int id = Utils.GetAuthorizedUserId(this.User);
				UserModel? user = await this.UserService.GetUserByIdAsync(id);
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

		[HttpPost]
		[Route("UploadAvatar")]
		public async Task<ActionResult<string>> UploadAvatarAsync([FromForm] IFormFile avatar)
		{
			try
			{
				int id = Utils.GetAuthorizedUserId(this.User);
				string avatarUrl = await ProfileService.UploadAvatarAsync(id, avatar);
				return avatarUrl;
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
