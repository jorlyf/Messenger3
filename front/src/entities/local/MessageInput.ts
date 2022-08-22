import { DialogTypes } from "../local/Dialog";
import MessageInputAttachment from "./MessageInputAttachment";

export default interface MessageInput {
  dialogId: number;
  dialogType: DialogTypes;
  text: string;
  attachments: MessageInputAttachment[];
}