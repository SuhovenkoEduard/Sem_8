import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { DailyLog, User } from "firestore/types/collections.types";

export const MODULE_NAME_USER = "currentUser";

export type UserSliceState = {
  user: User | null;
  isPending: boolean;
};

const initialState: UserSliceState = {
  user: null,
  isPending: false,
};

const userSlice = createSlice({
  name: MODULE_NAME_USER,
  initialState,
  reducers: {
    setIsPending: (state, action) => {
      state.isPending = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setDailyLog: (state, action) => {
      if (state.user?.diary) {
        const dailyLog: DailyLog = action.payload;
        state.user.diary.dailyLogs = [
          ...state.user.diary.dailyLogs.filter(
            (log) =>
              dayjs(log.createdAt).format("l") !==
              dayjs(dailyLog.createdAt).format("l")
          ),
          dailyLog,
        ];
      }
    },
  },
});

export const userReducer = userSlice.reducer;
export const { setIsPending, setUser, setDailyLog } = userSlice.actions;
