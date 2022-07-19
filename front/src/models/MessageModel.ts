import AttachmentModel from "./AttachmentModel";
import UserModel from "./UserModel";

export default interface MessageModel {
  id: number;
  senderUser: UserModel;
  text?: string;
  attachments?: AttachmentModel;
}