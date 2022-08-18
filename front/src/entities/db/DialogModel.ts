import Message from "../local/Message";

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
  avatarUrl: string | null;
  lastUpdateTotalMilliseconds: number;
}