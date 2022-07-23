import MessageModel from "../MessageModel";
import UserModel from "../UserModel";

export default interface GroupDialogDTO {
  groupId: number;
  users: UserModel[];
  messages: MessageModel[];
  name: string;
  lastUpdateTotalSeconds: number;
  groupAvatarUrl?: string;
}