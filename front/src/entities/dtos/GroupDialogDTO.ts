import MessageDTO from "./MessageDTO";

export default interface GroupDialogDTO {
  groupId: number;
  userIds: number[];
  messages: MessageDTO[];
  name: string;
  lastUpdateTotalSeconds: number;
  groupAvatarUrl: string | null;
}