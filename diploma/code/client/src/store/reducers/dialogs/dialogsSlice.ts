import { createSlice } from "@reduxjs/toolkit";
import { Dialog } from "firestore/types/collections.types";

export const MODULE_NAME_DIALOGS = "currentDialogs";

export type DialogsSliceState = {
  dialogs: Dialog[] | null;
  isPending: boolean;
};

const initialState: DialogsSliceState = {
  dialogs: null,
  isPending: false,
};

const dialogsSlice = createSlice({
  name: MODULE_NAME_DIALOGS,
  initialState,
  reducers: {
    setIsPending: (state, action) => {
      state.isPending = action.payload;
    },
    setDialogs: (state, action) => {
      state.dialogs = action.payload;
    },
  },
});

export const dialogsReducer = dialogsSlice.reducer;
export const { setIsPending, setDialogs } = dialogsSlice.actions;
