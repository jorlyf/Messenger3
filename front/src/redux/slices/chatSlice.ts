import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import DialogModel from "../../models/DialogModel";

interface ChatState {
  dialogs: DialogModel[];
  currentDialog?: DialogModel;
}

const initialState: ChatState = {
  dialogs: [],
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setDialogs(state, action: PayloadAction<DialogModel[]>) {
      state.dialogs = action.payload;
    },
    setCurrentDialog(state, action: PayloadAction<DialogModel>) {
      state.currentDialog = action.payload;
    }
  }
});

export const { setDialogs, setCurrentDialog } = chatSlice.actions;

export default chatSlice.reducer;