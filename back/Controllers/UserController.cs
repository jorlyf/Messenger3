using back.Entities.Db.User;
using back.Infrastructure;
using back.Infrastructure.Exceptions;
using back.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace back.Controllers
{
	[Authorize]
	[ApiController]
	[Route("api/[controller]")]
	public class UserController : ControllerBase
	{
		private UserService UserService { get; }

		public UserController(UserService userService)
		{
			this.UserService = userService;
		}


		[HttpGet]
		[Route("GetUser")]
		public async Task<ActionResult<UserModel>> GetUserAsync(int id)
		{
			try
			{
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

		[HttpGet]
		[Route("GetUsersByLoginContains")]
		public async Task<ActionResult<IEnumerable<UserModel>>> GetUsersByLoginContainsAsync(string login)
		{
			try
			{
				int senderId = Utils.GetAuthorizedUserId(this.User);
				return Ok(await this.UserService.GetUsersByLoginContainsAsync(senderId, login));
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
