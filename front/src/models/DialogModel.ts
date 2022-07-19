import MessageModel from "./MessageModel";
import UserModel from "./UserModel";

export default interface Dialog {
  id: number;
  name: string;
  isPrivate: boolean;
  users?: UserModel[];
  messages?: MessageModel[];
  avatarUrl: string | null;
}