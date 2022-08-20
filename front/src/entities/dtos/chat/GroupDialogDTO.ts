import MessageDTO from "./MessageDTO";

export default interface GroupDialogDTO {
  groupId: number;
  userIds: number[];
  messages: MessageDTO[];
  totalMessagesCount: number;
  name: string;
  lastUpdateTotalMilliseconds: number;
  groupAvatarUrl: string | null;
}