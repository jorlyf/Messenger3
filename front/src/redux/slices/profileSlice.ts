import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import UserModel from "../../models/UserModel";

interface ProfileState {
  isLoaded: boolean,
  id: number | null;
  login: string | null;
  username: string | null;
  avatarUrl: string | null;
}

const initialState: ProfileState = {
  isLoaded: false,
  id: null,
  login: null,
  username: null,
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
      state.username = action.payload.username;
      state.avatarUrl = action.payload.avatarUrl;
    },
    unloadProfile(state) {
      state.isLoaded = false;
      state.id = null;
      state.login = null;
      state.username = null;
      state.avatarUrl = null;
    },
    setUsername(state, action: PayloadAction<string>) {
      if (state.isLoaded) return;

      state.username = action.payload;
    },
    setAvatarUrl(state, action: PayloadAction<string>) {
      if (state.isLoaded) return;

      state.avatarUrl = action.payload;
    }
  }
});

export const { loadProfile, unloadProfile, setUsername, setAvatarUrl } = profileSlice.actions;

export default profileSlice.reducer;