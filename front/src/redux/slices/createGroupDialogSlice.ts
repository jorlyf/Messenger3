import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CreateGroupDialogState {
  open: boolean;
  userIds: number[];
}

const initialState: CreateGroupDialogState = {
  open: false,
  userIds: []
}

const createGroupDialogSlice = createSlice({
  name: "createGroupDialog",
  initialState,
  reducers: {
    openCreateDialogModal(state) {
      state.open = true;
    },
    closeCreateDialogModal(state) {
      state.open = false;
    },
    addUserId(state, action: PayloadAction<number>) {
      if (!state.userIds.includes(action.payload)) {
        state.userIds.push(action.payload);
      }
    },
    removeUserId(state, action: PayloadAction<number>) {
      state.userIds = state.userIds.filter(x => x !== action.payload);
    },
    clearUserIds(state) {
      state.userIds = [];
    }
  }
});

export const {
  openCreateDialogModal,
  closeCreateDialogModal,
  addUserId,
  removeUserId,
  clearUserIds
} = createGroupDialogSlice.actions;

export default createGroupDialogSlice.reducer;