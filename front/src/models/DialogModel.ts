import Message from "./Message";
import MessageInput from "./MessageInput";

export enum DialogTypes {
  private,
  group
}

export default interface DialogModel {
  id: number;
  type: DialogTypes;
  name: string;
  messages: Message[];
  userIds: number[];
  inputMessage: MessageInput;
  avatarUrl?: string;
}