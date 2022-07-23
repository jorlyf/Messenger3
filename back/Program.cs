using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using back.Contexts;
using back.Repositories;
using back.Services;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
	options.RequireHttpsMetadata = false;
	options.SaveToken = true;
	options.TokenValidationParameters = new TokenValidationParameters()
	{
		ClockSkew = TimeSpan.Zero,
		RequireAudience = false,
		ValidateIssuer = false,
		ValidateAudience = false,
		ValidateLifetime = true,
		IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
	};
});

builder.Services.AddDbContext<DataContext>(options =>
	options.UseSqlite($"Data Source={Environment.CurrentDirectory}\\messanger.db")
	.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking));

builder.Services.AddScoped<AsyncUnitOfWork>();

builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<ChatService>();
builder.Services.AddScoped<ProfileService>();

builder.Services.AddSingleton<FileService>();

builder.Services.AddCors(options =>
{
	options.AddPolicy("Development", policy =>
	{
		policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
			.AllowAnyHeader()
			.AllowAnyMethod()
			.AllowCredentials();
	});
	options.AddPolicy("Production", policy =>
	{
		policy.WithOrigins("http://localhost", "https://localhost")
			.AllowAnyHeader()
			.AllowAnyMethod()
			.AllowCredentials();
	});
});

WebApplication app = builder.Build();

if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

if (app.Environment.IsDevelopment())
{
	app.UseCors("Development");
}
else
{
	app.UseCors("Production");
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
