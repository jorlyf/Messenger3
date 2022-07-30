import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import DialogModel, { DialogTypes } from "../../models/DialogModel";
import AttachmentDTO from "../../models/dtos/AttachmentDTO";
import NewMessageDTO from "../../models/dtos/NewMessageDTO";
import Message from "../../models/Message";
import { uuid } from "../../utils";

interface CurrentDialogInfo {
  id: number;
  type: DialogTypes;
  index: number;
}

interface ChatState {
  dialogs: DialogModel[];
  currentDialogInfo: CurrentDialogInfo | null;
}

export const findCurrentDialog = (dialogs: DialogModel[], current: CurrentDialogInfo): DialogModel | null => {
  let dialog: DialogModel | null | undefined = findCurrentDialogByIndex(dialogs, current);
  if (dialog) {
    return dialog;
  }
  dialog = dialogs.find(x => x.id === current.id && x.type === current.type);
  return dialog ? dialog : null;
}
const findCurrentDialogByIndex = (dialogs: DialogModel[], current: CurrentDialogInfo): DialogModel | null => {
  if (current.index < 0) return null;

  const dialog = dialogs.at(current.index);
  if (!dialog) return null;
  if (dialog.id !== current.id || dialog.type !== current.type) return null;
  return dialog;
}

export const findDialog = (dialogs: DialogModel[], id: number, type: DialogTypes): DialogModel | null => {
  const dialog = dialogs.find(x => x.id === id && x.type === type);
  return dialog ? dialog : null;
}

const initialState: ChatState = {
  dialogs: [],
  currentDialogInfo: null
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setDialogs(state, action: PayloadAction<DialogModel[]>) {
      state.dialogs = action.payload;
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
        const dialog = findCurrentDialog(state.dialogs, state.currentDialogInfo);
        if (!dialog) return;

        dialog.inputMessage.text = action.payload;
      }
    },
    clearCurrentDialogInputMessage(state) {
      if (state.currentDialogInfo) {
        const dialog = findCurrentDialog(state.dialogs, state.currentDialogInfo);
        if (!dialog) return;

        dialog.inputMessage = { id: uuid(), text: "", attachments: [] }
      }
    },
    addCurrentDialogInputMessageAttachment(state, action: PayloadAction<AttachmentDTO>) {
      if (state.currentDialogInfo) {
        const dialog = findCurrentDialog(state.dialogs, state.currentDialogInfo);
        if (!dialog) return;

        dialog.inputMessage.attachments.push(action.payload);
      }
    },
    addCurrentDialogMessage(state, action: PayloadAction<Message>) {
      if (state.currentDialogInfo) {
        const dialog = findCurrentDialog(state.dialogs, state.currentDialogInfo);  
        if (!dialog) return;

        dialog.messages.push(action.payload);
      }
    },
    replaceCurrentDialogTempMessage(state, action: PayloadAction<{ message: Message, uuid: string }>) {
      if (state.currentDialogInfo) {
        const dialog = findCurrentDialog(state.dialogs, state.currentDialogInfo);
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
      const dialog = findDialog(state.dialogs, action.payload.dialogId, action.payload.dialogType);      
      if (!dialog) return;

      dialog.messages.push(action.payload.message);
    }
  }
});

export const {
  setDialogs,
  setCurrentDialogInfo,
  addDialog,
  removeDialogById,
  setCurrentDialogInputMessageText,
  clearCurrentDialogInputMessage,
  addCurrentDialogInputMessageAttachment,
  addCurrentDialogMessage,
  replaceCurrentDialogTempMessage,
  addDialogMessage
} = chatSlice.actions;

export default chatSlice.reducer;