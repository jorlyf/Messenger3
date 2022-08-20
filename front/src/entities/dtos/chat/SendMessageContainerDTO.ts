import { DialogTypes } from "../../local/Dialog";
import SendMessageDTO from "./SendMessageDTO";

export default interface SendMessageContainerDTO {
  toDialogId: number;
  dialogType: DialogTypes;
  sendMessageDTO: SendMessageDTO;
}