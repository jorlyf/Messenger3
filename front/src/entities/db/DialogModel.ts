import Message from "../local/Message";
import MessageInput from "../local/MessageInput";

export enum DialogTypes {
  private = "user",
  group = "group"
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