using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using back.Models;
using back.Models.DTOs;

namespace back.Services
{
	public class AuthService
	{
		private IConfiguration Configuration { get; }

		public AuthService(IConfiguration configuration)
		{
			this.Configuration = configuration;
		}

		public bool Login(LoginDataDTO loginData, out string token)
		{
			throw new NotImplementedException();
		}

		public bool Registrate(RegistrationDataDTO registrationData, out string token)
		{
			throw new NotImplementedException();
		}

		private string GenerateToken(UserModel user)
		{
			Claim[] claims = new[] {
						new Claim("Id", user.Id.ToString()),
						new Claim("Login", user.Login)
					};

			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this.Configuration["Jwt:Key"]));
			var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
			var token = new JwtSecurityToken(
				claims: claims,
				expires: DateTime.UtcNow.AddSeconds(20),
				signingCredentials: signIn);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}
	}
}
