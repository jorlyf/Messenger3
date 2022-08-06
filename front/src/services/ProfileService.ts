import $api from "../http";
import { loadProfile, unloadProfile } from "../redux/slices/profileSlice";
import { AppDispatch } from "../redux/store";
import UserModel from "../entities/db/UserModel";

export default class ProfileService {
  static async loadProfile(dispatch: AppDispatch) {
    try {
      const response = await $api.get<UserModel>("/Profile/LoadProfile");
      dispatch(loadProfile(response.data));
    } catch (error) {
      dispatch(unloadProfile());
    }
  }
  static async getUser(userId: number): Promise<UserModel | null> {
    try {
      const response = await $api.get<UserModel>(`/Profile/GetUser?id=${userId}`);
      return response.data;
    } catch (error) {
      return null;
    }
  }
  static async uploadAvatar(avatar: File): Promise<string | null> {
    const formData: FormData = new FormData();
    formData.set("avatar", avatar);

    try {
      const response = await $api.post<string>("/Profile/UploadAvatar", formData);
      return response.data;
    } catch (error) {
      return null;
    }
  }
}