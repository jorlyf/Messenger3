import Message from "../local/Message";
import MessageInput from "../local/MessageInput";

export enum DialogTypes {
  private = 0,
  group = 1
}

export default interface DialogModel {
  id: number;
  type: DialogTypes;
  name: string;
  messages: Message[];
  userIds: number[];
  inputMessage: MessageInput;
  avatarUrl: string | null;
  lastUpdateTotalMilliseconds: number;
}