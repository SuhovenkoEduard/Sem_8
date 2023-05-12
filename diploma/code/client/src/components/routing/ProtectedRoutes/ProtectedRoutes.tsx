import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { APP_ROUTES } from "components/routing/constants";
import { CircularProgress } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "firebase_config";
import { GlobalState, useAppDispatch } from "store";
import {
  setIsPending,
  setUser,
  UserSliceState,
} from "store/reducers/user/userSlice.tmp";
import { firebaseRepositories } from "firestore/data/repositories";
import { useSelector } from "react-redux";
import { NotificationManager } from "react-notifications";

export const ProtectedRoutes = () => {
  const [authUser, loading] = useAuthState(auth);
  const currentUser = useSelector<GlobalState, UserSliceState>(
    (state) => state.currentUser
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    return auth.onAuthStateChanged(async (userCredential) => {
      if (userCredential) {
        try {
          dispatch(setIsPending(true));
          const user = await firebaseRepositories.users.getDocById(
            userCredential.uid
          );
          dispatch(setUser(user));
        } catch (e) {
          dispatch(setIsPending(false));
          console.log(e);
          NotificationManager.error(
            "Error while loading user from firestore!",
            "Firestore error"
          );
        }
      } else {
        dispatch(setUser(null));
      }
    });
  }, [dispatch]);

  if (loading || (authUser && !currentUser.user)) {
    return <CircularProgress />;
  }

  return authUser && currentUser.user ? (
    <Outlet />
  ) : (
    <Navigate replace to={APP_ROUTES.auth} />
  );
};
