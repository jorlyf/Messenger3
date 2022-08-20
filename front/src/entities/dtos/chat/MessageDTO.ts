import UserModel from "../../db/UserModel";
import AttachmentDTO from "./AttachmentDTO";

export default interface MessageDTO {
  id: number;
  senderUser: UserModel;
  text: string | null;
  attachmentDTOs: AttachmentDTO[];
  sentAtTotalMilliseconds: number;
}