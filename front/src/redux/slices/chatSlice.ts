import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import DialogModel from "../../models/DialogModel";
import AttachmentDTO from "../../models/dtos/AttachmentDTO";
import Message from "../../models/Message";
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
    clearInputMessage(state) {
      if (state.currentDialog) {
        state.currentDialog.inputMessage = { id: uuid(), text: "", attachments: [] }
      }
    },
    addInputMessageAttachment(state, action: PayloadAction<AttachmentDTO>) {
      if (state.currentDialog) {
        state.currentDialog.inputMessage.attachments.push(action.payload);
      }
    },
    addCurrentDialogMessage(state, action: PayloadAction<Message>) {
      if (state.currentDialog) {
        state.currentDialog.messages.push(action.payload);
      }
    },
    replaceCurrentDialogTempMessage(state, action: PayloadAction<{ message: Message, uuid: string }>) {
      if (state.currentDialog) {
        const filtered = state.currentDialog.messages.filter(x => x.id === action.payload.uuid);
        if (!filtered) return;
        const tempMessage = filtered[0];
        const index = state.currentDialog.messages.indexOf(tempMessage);
        if (index > -1) {
          state.currentDialog.messages[index] = action.payload.message;
        }
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
  addInputMessageAttachment,
  addCurrentDialogMessage,
  replaceCurrentDialogTempMessage
} = chatSlice.actions;

export default chatSlice.reducer;