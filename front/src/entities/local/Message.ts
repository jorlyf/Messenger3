import Attachment from "./Attachment";
import UserModel from "../db/UserModel";

export enum MessageSendingStatus {
  ok,
  isSending,
  error
}

export default interface Message {
  id: string,
  apiId: number | null;
  text: string | null;
  attachments: Attachment[];
  senderUser: UserModel;
  status: MessageSendingStatus;
  sentAtTotalMilliseconds: number;
}