using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using back.Models;
using back.Repositories.Interfaces;
using back.Infrastructure.Exceptions;
using back.Models.DTOs.Auth;
using back.Repositories;

namespace back.Services
{
	public class AuthService
	{
		private IConfiguration Configuration { get; }
		private AsyncUnitOfWork UoW { get; }

		public AuthService(IConfiguration configuration, AsyncUnitOfWork uow)
		{
			this.Configuration = configuration;
			this.UoW = uow;
		}


		public async Task<string> LoginAsync(LoginDataDTO loginData)
		{
			UserModel? user = await this.UoW.UserRepository.GetByLoginAsync(loginData.Login);
			if (user is null)
			{
				throw new LoginException(LoginExceptionReasons.UserIsNotFound);
			}

			if (user.Password != loginData.Password)
			{
				throw new LoginException(LoginExceptionReasons.IncorrectLoginData);
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

			if (await this.UoW.UserRepository.GetByLoginAsync(registrationData.Login) is not null)
			{
				throw new RegistrationException(RegistrationExceptionReasons.LoginIsNotUnique);
			}

			await this.UoW.UserRepository.AddAsync(user);
			await this.UoW.UserRepository.SaveAsync();

			string token = GenerateToken(user);
			return token;
		}

		private string GenerateToken(UserModel user)
		{
			Claim[] claims = new[] {
						new Claim("id", user.Id.ToString()),
						new Claim("login", user.Login)
					};

			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this.Configuration["Jwt:Key"]));
			var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
			var token = new JwtSecurityToken(
				claims: claims,
				expires: DateTime.UtcNow.AddDays(30),
				signingCredentials: signIn);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}
	}
}
