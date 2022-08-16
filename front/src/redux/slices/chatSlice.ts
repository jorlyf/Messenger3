import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { uuid } from "../../utils";
import DialogService from "../../services/DialogService";
import DialogModel, { DialogTypes } from "../../entities/db/DialogModel";
import AttachmentDTO from "../../entities/dtos/AttachmentDTO";
import Message, { MessageSendingStatus } from "../../entities/local/Message";

export interface CurrentDialogInfo {
  id: number;
  type: DialogTypes;
  index: number;
}

interface ChatState {
  dialogs: DialogModel[];
  dialogsFetched: boolean;
  currentDialogInfo: CurrentDialogInfo | null;
}

const initialState: ChatState = {
  dialogs: [],
  dialogsFetched: false,
  currentDialogInfo: null
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setDialogs(state, action: PayloadAction<DialogModel[]>) {
      state.dialogs = action.payload;
    },
    setDialogsFetched(state, action: PayloadAction<boolean>) {
      state.dialogsFetched = action.payload;
    },
    setCurrentDialogInfo(state, action: PayloadAction<CurrentDialogInfo | null>) {
      state.currentDialogInfo = action.payload;
    },
    addDialog(state, action: PayloadAction<DialogModel>) {
      state.dialogs.push(action.payload);
    },
    removeDialogById(state, action: PayloadAction<number>) {
      state.dialogs = state.dialogs.filter(d => d.id !== action.payload);
    },
    setCurrentDialogInputMessageText(state, action: PayloadAction<string>) {
      if (state.currentDialogInfo) {
        const dialog = DialogService.findCurrentDialog(state.dialogs, state.currentDialogInfo);
        if (!dialog) return;

        dialog.inputMessage.text = action.payload;
      }
    },
    clearCurrentDialogInputMessage(state) {
      if (state.currentDialogInfo) {
        const dialog = DialogService.findCurrentDialog(state.dialogs, state.currentDialogInfo);
        if (!dialog) return;

        dialog.inputMessage = { id: uuid(), text: "", attachments: [] }
      }
    },
    addCurrentDialogInputMessageAttachment(state, action: PayloadAction<AttachmentDTO>) {
      if (state.currentDialogInfo) {
        const dialog = DialogService.findCurrentDialog(state.dialogs, state.currentDialogInfo);
        if (!dialog) return;

        dialog.inputMessage.attachments.push(action.payload);
      }
    },
    addCurrentDialogMessage(state, action: PayloadAction<Message>) {
      if (state.currentDialogInfo) {
        const dialog = DialogService.findCurrentDialog(state.dialogs, state.currentDialogInfo);
        if (!dialog) return;

        dialog.messages.push(action.payload);
      }
    },
    replaceDialogTempMessage(state, action: PayloadAction<{ dialogId: number, dialogType: DialogTypes, message: Message, uuid: string }>) {
      if (state.currentDialogInfo) {
        const dialog = DialogService.findDialog(state.dialogs, action.payload.dialogId, action.payload.dialogType);
        if (!dialog) return;

        const tempMessage = dialog.messages.find(x => x.id === action.payload.uuid);
        if (!tempMessage) return;

        const index = dialog.messages.indexOf(tempMessage);
        if (index > -1) {
          dialog.messages[index] = action.payload.message;
        }
      }
    },
    addDialogMessage(state, action: PayloadAction<{ dialogId: number, dialogType: DialogTypes, message: Message }>) {
      const dialog = DialogService.findDialog(state.dialogs, action.payload.dialogId, action.payload.dialogType);
      if (!dialog) return;

      dialog.messages.push(action.payload.message);
    },
    setMessageSendingStatus(state, action: PayloadAction<{ dialogId: number, dialogType: DialogTypes, uuid: string, status: MessageSendingStatus }>) {
      const dialog = DialogService.findDialog(state.dialogs, action.payload.dialogId, action.payload.dialogType);
      if (!dialog) return;

      const message = dialog.messages.find(x => x.id === action.payload.uuid);
      if (!message) return;

      message.status = action.payload.status;
    }
  }
});

export const {
  setDialogs,
  setDialogsFetched,
  setCurrentDialogInfo,
  addDialog,
  removeDialogById,
  setCurrentDialogInputMessageText,
  clearCurrentDialogInputMessage,
  addCurrentDialogInputMessageAttachment,
  addCurrentDialogMessage,
  replaceDialogTempMessage,
  addDialogMessage,
  setMessageSendingStatus
} = chatSlice.actions;

export default chatSlice.reducer;