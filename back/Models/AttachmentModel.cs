using System.ComponentModel.DataAnnotations;

namespace back.Models
{
	public enum AttachmentTypes: byte
	{
		Photo,
		Video,
		File
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
