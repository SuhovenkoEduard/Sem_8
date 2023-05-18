import { combineReducers, configureStore, Reducer } from "@reduxjs/toolkit";
import {
  MODULE_NAME_USER,
  userReducer,
  UserSliceState,
} from "store/reducers/user/userSlice";
import {
  dialogsReducer,
  DialogsSliceState,
  MODULE_NAME_DIALOGS,
} from "store/reducers/dialogs/dialogsSlice";
import { useDispatch } from "react-redux";
import { ACTION_NAMES } from "store/reducers/user/constants";

export type GlobalState = {
  [MODULE_NAME_USER]: UserSliceState;
  [MODULE_NAME_DIALOGS]: DialogsSliceState;
};

const appReducer: Reducer = combineReducers<GlobalState>({
  [MODULE_NAME_USER]: userReducer,
  [MODULE_NAME_DIALOGS]: dialogsReducer,
});

const rootReducer: Reducer<GlobalState> = (state, action) => {
  if (action.type === ACTION_NAMES.userSignOut) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
