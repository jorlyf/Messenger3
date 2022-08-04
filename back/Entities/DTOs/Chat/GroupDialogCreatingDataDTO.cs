namespace back.Entities.DTOs.Chat
{
	public class GroupDialogCreatingDataDTO
	{
		public int UserCreatorId { get; set; }
		public IEnumerable<int> UserIds { get; set; }
	}
}
