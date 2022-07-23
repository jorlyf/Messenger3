import MessageModel from "../MessageModel";
import UserModel from "../UserModel";

export default interface PrivateDialogDTO {
  user: UserModel;
  messages: MessageModel[];
  lastUpdateTotalSeconds: number;
  userAvatarUrl?: string;
}