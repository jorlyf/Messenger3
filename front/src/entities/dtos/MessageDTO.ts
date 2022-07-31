import AttachmentModel from "../db/AttachmentModel";
import UserModel from "../db/UserModel";

export default interface MessageDTO {
  senderUser: UserModel;
  text: string | null;
  attachments: AttachmentModel[];
  sentAtTotalMilliseconds: number;
}