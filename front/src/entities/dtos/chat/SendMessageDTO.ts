import SendAttachmentDTO from "./SendAttachmentDTO";

export default interface SendMessageDTO {
  text: string | null;
  sendAttachmentDTOs: SendAttachmentDTO[];
}