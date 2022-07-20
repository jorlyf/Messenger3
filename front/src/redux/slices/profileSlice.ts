import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import UserModel from "../../models/UserModel";

interface ProfileState {
  isLoaded: boolean,
  id: number | null;
  login: string | null;
  avatarUrl: string | null;
}

const initialState: ProfileState = {
  isLoaded: false,
  id: null,
  login: null,
  avatarUrl: null,
}

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    loadProfile(state, action: PayloadAction<UserModel>) {
      state.isLoaded = true;
      state.id = action.payload.id;
      state.login = action.payload.login;
      state.avatarUrl = action.payload.avatarUrl;
    },
    unloadProfile(state) {
      state.isLoaded = false;
      state.id = null;
      state.login = null;
      state.avatarUrl = null;
    },
    setAvatarUrl(state, action: PayloadAction<string>) {
      if (state.isLoaded) return;

      state.avatarUrl = action.payload;
    }
  }
});

export const { loadProfile, unloadProfile, setAvatarUrl } = profileSlice.actions;

export default profileSlice.reducer;