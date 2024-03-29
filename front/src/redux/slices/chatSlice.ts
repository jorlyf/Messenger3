import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import DialogService from "../../services/DialogService";
import MessageService from "../../services/MessageService";
import Dialog, { DialogTypes } from "../../entities/local/Dialog";
import Message, { MessageSendingStatus } from "../../entities/local/Message";
import MessageInput from "../../entities/local/MessageInput";
import MessageInputAttachment from "../../entities/local/MessageInputAttachment";

export interface CurrentDialogInfo {
  id: number;
  type: DialogTypes;
  index: number;
}

interface ChatState {
  dialogs: Dialog[];
  totalDialogCount: number | null;
  dialogsFetched: boolean;
  currentDialogInfo: CurrentDialogInfo | null;
  messageInputs: MessageInput[];
}

const initialState: ChatState = {
  dialogs: [],
  totalDialogCount: null,
  dialogsFetched: false,
  currentDialogInfo: null,
  messageInputs: []
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setDialogs(state, action: PayloadAction<Dialog[]>) {
      state.dialogs = action.payload;
    },
    setTotalDialogCount(state, action: PayloadAction<number>) {
      state.totalDialogCount = action.payload;
    },
    setDialogsFetched(state, action: PayloadAction<boolean>) {
      state.dialogsFetched = action.payload;
    },
    setCurrentDialogInfo(state, action: PayloadAction<CurrentDialogInfo | null>) {
      state.currentDialogInfo = action.payload;
    },
    addDialog(state, action: PayloadAction<Dialog>) {
      state.dialogs.push(action.payload);
    },
    addDialogs(state, action: PayloadAction<Dialog[]>) {
      state.dialogs = [...state.dialogs, ...action.payload];
    },
    removeDialogById(state, action: PayloadAction<number>) {
      state.dialogs = state.dialogs.filter(d => d.id !== action.payload);
    },
    setCurrentDialogMessageInputText(state, action: PayloadAction<string>) {
      if (state.currentDialogInfo) {
        const dialog = DialogService.findCurrentDialog(state.dialogs, state.currentDialogInfo);
        if (!dialog) return;

        const messageInput = MessageService.getMessageInput(state.messageInputs, state.currentDialogInfo.id, state.currentDialogInfo.type);

        messageInput.text = action.payload;
      }
    },
    clearCurrentDialogMessageInput(state) {
      if (state.currentDialogInfo) {
        const dialog = DialogService.findCurrentDialog(state.dialogs, state.currentDialogInfo);
        if (!dialog) return;

        const messageInput = MessageService.getMessageInput(state.messageInputs, state.currentDialogInfo.id, state.currentDialogInfo.type);

        messageInput.text = "";
        messageInput.attachments = [];
      }
    },
    addDialogMessages(state, action: PayloadAction<{ dialogId: number, dialogType: DialogTypes, messages: Message[] }>) {
      const dialog = DialogService.findDialog(state.dialogs, action.payload.dialogId, action.payload.dialogType);
      if (!dialog) return;

      dialog.messages = [...dialog.messages, ...action.payload.messages];
    },
    addCurrentDialogMessageInputAttachments(state, action: PayloadAction<MessageInputAttachment[]>) {
      if (state.currentDialogInfo) {
        const dialog = DialogService.findCurrentDialog(state.dialogs, state.currentDialogInfo);
        if (!dialog) return;

        const messageInput = MessageService.getMessageInput(state.messageInputs, state.currentDialogInfo.id, state.currentDialogInfo.type);

        messageInput.attachments = [...messageInput.attachments, ...action.payload];
      }
    },
    removeCurrentDialogMessageInputAttachment(state, action: PayloadAction<string>) {
      if (state.currentDialogInfo) {
        const dialog = DialogService.findCurrentDialog(state.dialogs, state.currentDialogInfo);
        if (!dialog) return;

        const messageInput = MessageService.getMessageInput(state.messageInputs, state.currentDialogInfo.id, state.currentDialogInfo.type);

        const idToRemove = action.payload;
        messageInput.attachments = messageInput.attachments.filter(x => x.id !== idToRemove);
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
    },
    updateDialogTotalMilliseconds(state, action: PayloadAction<{ dialogId: number, dialogType: DialogTypes, value: number }>) {
      const dialog = DialogService.findDialog(state.dialogs, action.payload.dialogId, action.payload.dialogType);
      if (!dialog) return;

      dialog.lastUpdateTotalMilliseconds = action.payload.value;
    }
  }
});

export const {
  setDialogs,
  setTotalDialogCount,
  setDialogsFetched,
  setCurrentDialogInfo,
  addDialog,
  addDialogs,
  removeDialogById,
  setCurrentDialogMessageInputText,
  clearCurrentDialogMessageInput,
  addDialogMessages,
  addCurrentDialogMessageInputAttachments,
  removeCurrentDialogMessageInputAttachment,
  addCurrentDialogMessage,
  replaceDialogTempMessage,
  addDialogMessage,
  setMessageSendingStatus,
  updateDialogTotalMilliseconds
} = chatSlice.actions;

export default chatSlice.reducer;