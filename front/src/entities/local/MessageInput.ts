import { DialogTypes } from "../db/DialogModel";
import AttachmentDTO from "../dtos/AttachmentDTO";

export default interface MessageInput {
  dialogId: number;
  dialogType: DialogTypes;
  text: string;
  attachments: AttachmentDTO[];
}