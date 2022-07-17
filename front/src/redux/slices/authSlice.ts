import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token?: string;
  isAuthorized: boolean;
  isLogging: boolean;
  wasInitAuthAttempt: boolean;
}

const initialState: AuthState = {
  isAuthorized: false,
  isLogging: false,
  wasInitAuthAttempt: false
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginInit(state) {
      state.isLogging = true;
    },
    loginSuccess(state, action: PayloadAction<string>) {
      state.isLogging = false;
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
      state.isAuthorized = true;
      state.wasInitAuthAttempt = true;
    },
    loginError(state) {
      state.isLogging = false;
      state.token = undefined;
      state.isAuthorized = false;
      state.wasInitAuthAttempt = true;
    },
    setInitAuthAttempt(state, action: PayloadAction<boolean>) {
      state.wasInitAuthAttempt = action.payload;
    }
  }
});

export const { loginInit, loginSuccess, loginError, setInitAuthAttempt } = authSlice.actions;

export default authSlice.reducer;