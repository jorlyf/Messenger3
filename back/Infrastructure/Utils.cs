using System.Security.Claims;

namespace back.Infrastructure
{
	public static class Utils
	{
		public static string RootPath { get => Environment.CurrentDirectory; }
		public static string UserDataPath { get => Path.Combine(RootPath, "UserData"); }

		public static int GetAuthorizedUserId(ClaimsPrincipal user)
		{

			return int.Parse(user.Claims.First(x => x.Type == "id").Value);
		}

		public static long GetTotalMilliseconds(DateTime dateTime)
		{
			return new DateTimeOffset(dateTime).ToUnixTimeMilliseconds();
		}
	}
}
