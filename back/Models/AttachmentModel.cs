using System.ComponentModel.DataAnnotations;

namespace back.Models
{
	public enum AttachmentTypes: byte
	{
		Photo = 1,
		Video = 2,
		File = 3
	}
	public class AttachmentModel
	{
		[Key]
		public int Id { get; set; }

		[Required]
		public AttachmentTypes Type { get; set; }

		[Required]
		public string Url { get; set; }
	}
}
