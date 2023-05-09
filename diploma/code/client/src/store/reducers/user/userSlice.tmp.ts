import { createSlice } from "@reduxjs/toolkit";
import { User as FirebaseUser } from "firebase/auth";

// todo change state of user slice from UserCredential to UserInfo (firestore)

export const MODULE_NAME_USER = "currentUser";

export type UserSliceState = {
  user: FirebaseUser | null;
  isPending: boolean;
};

const initialState: UserSliceState = {
  user: null,
  isPending: false,
};

const userSliceTmp = createSlice({
  name: MODULE_NAME_USER,
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     // sing-in, sing-out pending
  //     .addMatcher(
  //       (action) =>
  //         [requestSignIn.pending.type, requestSignOut.pending.type].includes(
  //           action.type
  //         ),
  //       (state, action) => {
  //         state.isPending = true;
  //         state.user = null;
  //         localStorage.setItem("token", "");
  //         console.log(`[${action.type}]: PENDING`, { state, action });
  //       }
  //     )
  //     .addMatcher(
  //       (action) => [requestSignIn.fulfilled.type].includes(action.type),
  //       (state, action) => {
  //         state.isPending = false;
  //         state.user = action.payload.userCredentials.user;
  //         localStorage.setItem("token", action.payload.idToken);
  //         console.log(`[${action.type}]: FULFILLED`, { state, action });
  //       }
  //     )
  //     .addMatcher(
  //       (action) =>
  //         [requestSignIn.rejected.type, requestSignOut.rejected.type].includes(
  //           action.type
  //         ),
  //       (state, action) => {
  //         state.isPending = false;
  //         state.user = null;
  //         localStorage.setItem("token", "");
  //         console.log(`[${action.type}]: REJECTED`, { state, action });
  //       }
  //     )
  //     .addMatcher(
  //       (action) => action.type === requestSignOut.fulfilled.type,
  //       (state, action) => {
  //         state.isPending = false;
  //         state.user = null;
  //         localStorage.setItem("token", "");
  //         console.log(`[${action.type}]: FULFILLED`, { state, action });
  //       }
  //     );
  // },
});

export const userReducer = userSliceTmp.reducer;
export const { setUser } = userSliceTmp.actions;
