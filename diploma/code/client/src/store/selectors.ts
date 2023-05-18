import { GlobalState } from "store/store";
import { User } from "firestore/types/collections.types";
import { convertUserToUserInfo } from "firestore/converters";
import { createSelector } from "reselect";

export const getUserSelector = (state: GlobalState) => {
  return state.currentUser.user as User;
};

export const getUserInfoSelector = createSelector([getUserSelector], (user) =>
  convertUserToUserInfo(user)
);

export const getDialogsSelector = (state: GlobalState) =>
  state.currentDialogs.dialogs;
