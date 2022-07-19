using System.Security.Claims;

namespace back.Infrastructure
{
	public static class Utils
	{
		public static int GetAuthorizedUserId(ClaimsPrincipal user)
		{

			return int.Parse(user.Claims.First(x => x.Type == "id").Value);
		}
	}
}
