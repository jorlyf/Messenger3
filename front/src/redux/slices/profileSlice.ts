import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import UserModel from "../../entities/db/UserModel";

interface ProfileState {
  isLoaded: boolean;
  user: UserModel | null;
}

const initialState: ProfileState = {
  isLoaded: false,
  user: null
}

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    loadProfile(state, action: PayloadAction<UserModel>) {
      state.isLoaded = true;
      state.user = {
        id: action.payload.id,
        login: action.payload.login,
        avatarUrl: action.payload.avatarUrl
      }
    },
    unloadProfile(state) {
      state.isLoaded = false;
      state.user = null;
    },
    setAvatarUrl(state, action: PayloadAction<string>) {
      if (!state.isLoaded) return;
      if (!state.user) return;

      state.user.avatarUrl = action.payload;
    }
  }
});

export const { loadProfile, unloadProfile, setAvatarUrl } = profileSlice.actions;

export default profileSlice.reducer;