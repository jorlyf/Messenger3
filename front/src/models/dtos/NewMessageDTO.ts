import { DialogTypes } from "../DialogModel";
import MessageDTO from "./MessageDTO";

export default interface NewMessageDTO {
  dialogId: number;
  dialogType: DialogTypes | number;
  messageDTO: MessageDTO;
}