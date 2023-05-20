import React, { useCallback, useEffect } from "react";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { auth } from "firebase_config";
import { ACTION_NAMES } from "store/reducers/user/constants";
import { NotificationManager } from "react-notifications";
import { Routes } from "components/routing";
import { useAppDispatch } from "store";
import { Outlet, useNavigate } from "react-router-dom";
import { LoadingSpinner } from "components/ui/LoadingSpinner";
import { streamClient } from "components/App/App";

export const SignOut = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [signOut, , error] = useSignOut(auth);

  const [user, loading] = useAuthState(auth);

  const onSignOut = useCallback(async () => {
    if (loading) {
      return;
    }

    if (!user) {
      navigate(Routes.auth);
      return;
    }

    await signOut();
    if (streamClient.user?.online) {
      await streamClient.disconnectUser();
    }

    dispatch({ type: ACTION_NAMES.userSignOut });
    NotificationManager.success("Sign out successful!");
    navigate(Routes.auth);
  }, [signOut, dispatch, navigate, loading]);

  useEffect(() => {
    onSignOut();
  }, [onSignOut]);

  useEffect(() => {
    if (error) {
      NotificationManager.error(error?.name, error?.message);
      navigate(-1);
    }
  }, [error, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return <Outlet />;
};
