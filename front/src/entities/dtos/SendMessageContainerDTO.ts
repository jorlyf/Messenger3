import { DialogTypes } from "../db/DialogModel";
import SendMessageDTO from "./SendMessageDTO";

export default interface SendMessageContainerDTO {
  toId: number;
  type: DialogTypes;
  message: SendMessageDTO;
}