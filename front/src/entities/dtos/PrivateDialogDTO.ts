import MessageDTO from "./MessageDTO";

export default interface PrivateDialogDTO {
  userId: number;
  messages: MessageDTO[];
  name: string;
  userAvatarUrl?: string;
  LastUpdateTotalMilliseconds: number;
}