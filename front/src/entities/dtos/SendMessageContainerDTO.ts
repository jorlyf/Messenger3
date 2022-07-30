import SendMessageDTO from "./SendMessageDTO";

export default interface SendMessageContainerDTO {
  toId: number;
  message: SendMessageDTO;
}