using Microsoft.AspNetCore.Mvc;

namespace back.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class AuthController : ControllerBase
	{
		[HttpGet]
		[Route("LoginByToken")]
		public IActionResult LoginByToken([FromHeader] string authorization)
		{
			

			return Ok();
		}
	}
}
