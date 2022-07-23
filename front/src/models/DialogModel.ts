import MessageInput from "./MessageInput";
import MessageModel from "./MessageModel";
import UserModel from "./UserModel";

export enum DialogTypes {
  private,
  group
}

export default interface DialogModel {
  id: number;
  type: DialogTypes;
  name: string;
  messages: MessageModel[];
  users: UserModel[];
  inputMessage: MessageInput;
  avatarUrl?: string;
}