import { GlobalState } from "store/store";
import { User } from "firestore/types/collections.types";
import {
  convertDailyLogToDailyLogData,
  convertUserToUserInfo,
} from "firestore/converters";
import { createSelector } from "reselect";

export const getUserSelector = (state: GlobalState) => {
  return state.currentUser.user as User;
};

export const getUserIdSelector = createSelector(
  [getUserSelector],
  (user) => user.docId
);

export const getUserInfoSelector = createSelector([getUserSelector], (user) =>
  convertUserToUserInfo(user)
);

export const getDialogsSelector = (state: GlobalState) =>
  state.currentDialogs.dialogs;

export const getDailyLogsSelector = createSelector(
  [getUserSelector],
  (user) => user.diary?.dailyLogs ?? []
);
export const getDailyLogsDataSelector = createSelector(
  [getDailyLogsSelector],
  (dailyLogs) => dailyLogs.map(convertDailyLogToDailyLogData)
);
