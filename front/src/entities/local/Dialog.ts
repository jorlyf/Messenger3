import Message from "./Message";

export enum DialogTypes {
  private = 0,
  group = 1
}

export default interface Dialog {
  id: number;
  type: DialogTypes;
  name: string;
  messages: Message[];
  totalMessagesCount: number;
  userIds: number[];
  avatarUrl: string | null;
  lastUpdateTotalMilliseconds: number;
}