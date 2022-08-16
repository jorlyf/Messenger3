import $api from "../http";
import { loadProfile, unloadProfile } from "../redux/slices/profileSlice";
import { AppDispatch } from "../redux/store";
import UserModel from "../entities/db/UserModel";

export default class ProfileService {

  /** load owner user */
  static async loadProfile(dispatch: AppDispatch) {
    try {
      const response = await $api.get<UserModel>("/Profile/LoadProfile");
      dispatch(loadProfile(response.data));
    } catch (error) {
      dispatch(unloadProfile());
    }
  }

  /** return avatar url */
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