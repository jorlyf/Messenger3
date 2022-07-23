import AttachmentDTO from "./dtos/AttachmentDTO";

export default interface MessageInput {
  id: string;
  text: string;
  attachments: AttachmentDTO[];
}