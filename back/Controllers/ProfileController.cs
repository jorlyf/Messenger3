using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using back.Models;
using back.Services;
using System.Security.Claims;
using back.Infrastructure;

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
		public async Task<ActionResult<UserModel?>> LoadProfileAsync()
		{
			try
			{
				int id = Utils.GetAuthorizedUserId(this.User);
				UserModel? user = await this.ProfileService.LoadUserAsync(id);
				if (user == null) { throw new Exception("user is not found"); }

				return Ok(user);
			}
			catch (Exception)
			{
				return BadRequest();
			}
		}
	}
}
