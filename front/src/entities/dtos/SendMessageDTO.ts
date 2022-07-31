import AttachmentDTO from "./AttachmentDTO";

export default interface SendMessageDTO {
  text: string | null;
  attachments: AttachmentDTO[];
}