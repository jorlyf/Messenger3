using back.Models;
using back.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace back.Controllers
{
	[Authorize]
	[ApiController]
	[Route("api/[controller]")]
	public class ChatController : ControllerBase
	{
		private ChatService ChatService { get; }
		public ChatController(ChatService chatService)
		{
			this.ChatService = chatService;
		}

		[HttpGet]
		[Route("SearchDialogsByNameContains")]
		public async Task<ActionResult> SearchDialogsByNameContainsAsync(string name)
		{
			try
			{
				return Ok(await this.ChatService.SearchDialogsByNameContainsAsync(name));
			}
			catch (Exception)
			{
				return BadRequest();
			}
		}

		[HttpGet]
		[Route("SearchUsersByLoginContains")]
		public async Task<ActionResult<IEnumerable<UserModel>>> SearchUsersByLoginContainsAsync(string login)
		{
			try
			{
				return Ok(await this.ChatService.SearchUsersByLoginContainsAsync(login));
			}
			catch (Exception)
			{
				return BadRequest();
			}
		}
	}
}
