import { DialogTypes } from "../local/Dialog";
import Attachment from "./Attachment";

export default interface MessageInput {
  dialogId: number;
  dialogType: DialogTypes;
  text: string;
  attachments: Attachment[];
}