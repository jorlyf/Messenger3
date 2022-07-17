using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using back.Models.DTOs;
using back.Services;

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
		[ProducesResponseType(StatusCodes.Status200OK)]
		public ActionResult LoginByToken()
		{		
			return Ok();
		}

		[HttpPost]
		[Route("Login")]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status200OK)]
		public ActionResult<string> Login([FromBody] LoginDataDTO loginData)
		{
			if (this.AuthService.Login(loginData, out string token))
			{
				return token;
			}
			return BadRequest();
		}

		[HttpPost]
		[Route("Registrate")]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status200OK)]
		public ActionResult<string> Registrate([FromBody] RegistrationDataDTO registrationData)
		{
			if (this.AuthService.Registrate(registrationData, out string token))
			{
				return token;
			}
			return BadRequest();
		}
	}
}
