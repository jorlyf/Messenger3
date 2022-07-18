using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using back.Models;
using back.Repositories.Interfaces;
using back.Infrastructure.Exceptions;
using back.Models.DTOs.Auth;

namespace back.Services
{
	public class AuthService
	{
		private IConfiguration Configuration { get; }

		private IAsyncUserRepository UserRepository { get; }

		public AuthService(IConfiguration configuration, IAsyncUserRepository asyncUserRepository)
		{
			this.Configuration = configuration;
			this.UserRepository = asyncUserRepository;
		}

		public async Task<string> LoginAsync(LoginDataDTO loginData)
		{
			UserModel? user = await this.UserRepository.GetByLoginAsync(loginData.Login);
			if (user is null)
			{
				throw new LoginException(LoginExceptionReasons.UserIsNotFound);
			}

			string token = GenerateToken(user);
			return token;
		}

		public async Task<string> RegistrateAsync(RegistrationDataDTO registrationData)
		{
			UserModel user = new()
			{
				Login = registrationData.Login,
				Username = registrationData.Username,
				Password = registrationData.Password
			};

			if (await this.UserRepository.GetByLoginAsync(registrationData.Login) is not null)
			{
				throw new RegistrationException(RegistrationExceptionReasons.LoginIsNotUnique);
			}

			await this.UserRepository.AddAsync(user);
			await this.UserRepository.SaveAsync();

			string token = GenerateToken(user);
			return token;
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
