import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  
}

const initialState: ChatState = {
  
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {

  }
});

export const { } = chatSlice.actions;

export default chatSlice.reducer;