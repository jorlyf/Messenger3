import MessageModel from "../MessageModel";

export default interface PrivateDialogDTO {
  userId: number;
  messages: MessageModel[];
  name: string;
  userAvatarUrl?: string;
  lastUpdateTotalSeconds: number;
}