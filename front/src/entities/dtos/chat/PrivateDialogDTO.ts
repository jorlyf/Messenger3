import MessageDTO from "./MessageDTO";

export default interface PrivateDialogDTO {
  userId: number;
  messages: MessageDTO[];
  totalMessagesCount: number;
  name: string;
  userAvatarUrl: string | null;
  lastUpdateTotalMilliseconds: number;
}