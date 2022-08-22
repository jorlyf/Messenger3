import SendAttachmentDTO from "./SendAttachmentDTO";

export default interface SendMessageDTO {
  text: string;
  sendAttachmentDTOs: SendAttachmentDTO[];
}