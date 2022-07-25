import MessageInput from "./MessageInput";
import MessageModel from "./MessageModel";

export enum DialogTypes {
  private,
  group
}

export default interface DialogModel {
  id: number;
  type: DialogTypes;
  name: string;
  messages: MessageModel[];
  userIds: number[];
  inputMessage: MessageInput;
  avatarUrl?: string;
}