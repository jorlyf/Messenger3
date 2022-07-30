import AttachmentDTO from "./AttachmentDTO";

export default interface SendMessageDTO {
  text?: string;
  attachments?: AttachmentDTO[];
}