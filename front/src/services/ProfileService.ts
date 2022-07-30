import $api from "../http";
import UserModel from "../entities/db/UserModel";
import { loadProfile, unloadProfile } from "../redux/slices/profileSlice";
import { AppDispatch } from "../redux/store";

export default class ProfileService {
  static async LoadProfile(dispatch: AppDispatch) {
    try {
      const response = await $api.get<UserModel>("/Profile/LoadProfile");
      dispatch(loadProfile(response.data));
    } catch (error) {
      dispatch(unloadProfile());
    }
  }
}