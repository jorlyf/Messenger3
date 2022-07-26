import AttachmentModel from "../AttachmentModel";
import UserModel from "../UserModel";

export default interface MessageDTO {
  senderUser: UserModel;
  text?: string;
  attachments?: AttachmentModel[];
  sentAtTotalMilliseconds: number;
}