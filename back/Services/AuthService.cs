using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using back.Infrastructure.Exceptions;
using back.Entities.DTOs.Auth;
using back.Repositories;
using back.Entities.Db.User;

namespace back.Services
{
	public class AuthService
	{
		private IConfiguration Configuration { get; }
		private UnitOfWork UoW { get; }

		public AuthService(IConfiguration configuration, UnitOfWork uow)
		{
			this.Configuration = configuration;
			this.UoW = uow;
		}


		public async Task<string> LoginAsync(LoginDataDTO loginData)
		{
			UserModel? user = await this.UoW.UserRepository.GetByLogin(loginData.Login).FirstOrDefaultAsync();
			if (user == null)
			{
				throw new ApiException(ApiExceptionReason.UserIsNotFound);
			}

			if (user.Password != loginData.Password)
			{
				throw new ApiException(ApiExceptionReason.IncorrectLoginData);
			}

			string token = GenerateToken(user);
			return token;
		}

		public async Task<string> RegistrateAsync(RegistrationDataDTO registrationData)
		{
			UserModel user = new()
			{
				Login = registrationData.Login,
				Password = registrationData.Password
			};

			if ((await this.UoW.UserRepository.GetByLogin(user.Login).FirstOrDefaultAsync()) != null)
			{
				throw new ApiException(ApiExceptionReason.LoginIsNotUnique);
			}

			await this.UoW.UserRepository.AddAsync(user);
			await this.UoW.UserRepository.SaveAsync();

			string token = GenerateToken(user);
			return token;
		}

		private string GenerateToken(UserModel user)
		{
			Claim[] claims = new[]
			{
				new Claim("id", user.Id.ToString()),
				new Claim("login", user.Login)
			};

			SymmetricSecurityKey key = new(Encoding.UTF8.GetBytes(this.Configuration["Jwt:Key"]));
			SigningCredentials signIn = new(key, SecurityAlgorithms.HmacSha256);
			JwtSecurityToken token = new(
				claims: claims,
				expires: DateTime.UtcNow.AddDays(30),
				signingCredentials: signIn);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}
	}
}
