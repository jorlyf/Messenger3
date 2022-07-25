import MessageModel from "../MessageModel";

export default interface GroupDialogDTO {
  groupId: number;
  userIds: number[];
  messages: MessageModel[];
  name: string;
  lastUpdateTotalSeconds: number;
  groupAvatarUrl?: string;
}