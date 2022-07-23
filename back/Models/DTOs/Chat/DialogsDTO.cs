using System.ComponentModel.DataAnnotations;

namespace back.Models.DTOs.Chat
{
	public class DialogsDTO
	{
		[Required]
		public IEnumerable<PrivateDialogDTO> PrivateDialogDTOs { get; set; }

		[Required]
		public IEnumerable<GroupDialogDTO> GroupDialogDTOs { get; set; }
	}
}
