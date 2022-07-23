import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import DialogModel from "../../models/DialogModel";
import AttachmentDTO from "../../models/dtos/AttachmentDTO";
import { uuid } from "../../utils";

interface ChatState {
  dialogs: DialogModel[];
  currentDialog?: DialogModel;
}

const initialState: ChatState = {
  dialogs: []
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setDialogs(state, action: PayloadAction<DialogModel[]>) {
      state.dialogs = action.payload;
    },
    setCurrentDialog(state, action: PayloadAction<DialogModel | undefined>) {
      state.currentDialog = action.payload;
    },
    addDialog(state, action: PayloadAction<DialogModel>) {
      state.dialogs.push(action.payload);
    },
    removeDialogById(state, action: PayloadAction<number>) {
      state.dialogs = state.dialogs.filter(d => d.id !== action.payload);
    },

    setTextInputMessage(state, action: PayloadAction<string>) {
      if (state.currentDialog) {
        state.currentDialog.inputMessage.text = action.payload;
      }
    },
    clearInputMessage(state, action: PayloadAction<number>) {
      if (state.currentDialog) {
        state.currentDialog.inputMessage = { id: uuid(), text: "", attachments: [] }
      }
    },
    addInputMessageAttachment(state, action: PayloadAction<AttachmentDTO>) {
      if (state.currentDialog) {
        state.currentDialog.inputMessage.attachments.push(action.payload);
      }
    }
  }
});

export const {
  setDialogs,
  setCurrentDialog,
  addDialog,
  removeDialogById,
  setTextInputMessage,
  clearInputMessage,
  addInputMessageAttachment
} = chatSlice.actions;

export default chatSlice.reducer;