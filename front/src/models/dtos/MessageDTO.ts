import AttachmentDTO from "./AttachmentDTO";

export default interface MessageDTO {
  text?: string;
  attachments?: AttachmentDTO[];
}