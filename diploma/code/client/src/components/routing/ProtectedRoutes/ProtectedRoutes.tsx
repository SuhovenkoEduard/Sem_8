import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Routes } from "components/routing/constants";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "firebase_config";
import { GlobalState, useAppDispatch } from "store";
import { setUser, UserSliceState } from "store/reducers/user/userSlice";
import { useSelector } from "react-redux";
import { Layout } from "components/layout/Layout";
import { LoadingSpinner } from "components/ui/LoadingSpinner";
import { fetchUser } from "store/reducers/user/actions";

export const ProtectedRoutes = () => {
  const [authUser, loading] = useAuthState(auth);
  const currentUser = useSelector<GlobalState, UserSliceState>(
    (state) => state.currentUser
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    return auth.onAuthStateChanged(async (userCredential) => {
      if (userCredential) {
        await dispatch(fetchUser(userCredential.uid));
      } else {
        dispatch(setUser(null));
      }
    });
  }, [dispatch]);

  if (loading || (authUser && !currentUser.user)) {
    return <LoadingSpinner />;
  }

  return authUser && currentUser.user ? (
    <Layout />
  ) : (
    <Navigate replace to={Routes.auth} />
  );
};
