import UserModel from "./UserModel";

export default interface Dialog {
  id: number;
  name: string;
  users: UserModel[];
  avatarUrl?: string;
}