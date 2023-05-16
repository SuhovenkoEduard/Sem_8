import React, { useCallback, useEffect } from "react";
import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "firebase_config";
import { ACTION_NAMES } from "store/reducers/user/constants";
import { NotificationManager } from "react-notifications";
import { Routes } from "components/routing";
import { useAppDispatch } from "store";
import { Outlet, useNavigate } from "react-router-dom";
import { LoadingSpinner } from "components/ui/LoadingSpinner";

export const SignOut = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [signOut, loading, error] = useSignOut(auth);

  const onSignOut = useCallback(async () => {
    await signOut();
    dispatch({ type: ACTION_NAMES.userSignOut });
    NotificationManager.success("Sign out successful!");
    navigate(Routes.auth);
  }, [signOut, dispatch, navigate]);

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
