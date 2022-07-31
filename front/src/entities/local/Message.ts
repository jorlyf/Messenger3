import Attachment from "./Attachment";
import UserModel from "../db/UserModel";

export enum MessageSendingStatus {
  ok,
  isSending,
  error
}

export default interface Message {
  id: string,
  text: string | null;
  attachments: Attachment[];
  senderUser: UserModel;
  status: MessageSendingStatus;
  timeMilliseconds: number;
}