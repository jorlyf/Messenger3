using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using back.Services;
using back.Models.DTOs.Auth;
using back.Infrastructure.Exceptions;

namespace back.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class AuthController : ControllerBase
	{
		private AuthService AuthService { get; }

		public AuthController(AuthService authService)
		{
			this.AuthService = authService;
		}


		[Authorize]
		[HttpPost]
		[Route("LoginByToken")]
		public ActionResult LoginByToken()
		{
			return Ok();
		}

		[HttpPost]
		[Route("Login")]
		public async Task<ActionResult<LoginAnswerDataDTO>> LoginAsync([FromBody] LoginDataDTO loginData)
		{
			try
			{
				string token = await this.AuthService.LoginAsync(loginData);
				return Ok(new LoginAnswerDataDTO
				{
					Token = token
				});
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
		[Route("Registrate")]
		public async Task<ActionResult<RegistrationAnswerDataDTO>> RegistrateAsync([FromBody] RegistrationDataDTO registrationData)
		{
			try
			{
				string token = await this.AuthService.RegistrateAsync(registrationData);
				return Ok(new RegistrationAnswerDataDTO
				{
					Token = token
				});
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
