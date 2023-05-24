import React, { useCallback, useEffect } from "react";
import { auth } from "firebase_config";
import { ACTION_NAMES } from "store/reducers/user/constants";
import { NotificationManager } from "react-notifications";
import { Route } from "components/routing";
import { useAppDispatch } from "store";
import { Outlet, useNavigate } from "react-router-dom";
import { streamClient } from "containers/App/App";

export const SignOut = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onSignOut = useCallback(async () => {
    try {
      if (!auth.currentUser) {
        navigate(Route.home);
        return;
      }
      await auth.signOut();
      if (streamClient.user?.online) {
        streamClient.disconnectUser().catch((e) => {
          console.log(e);
          NotificationManager.error("Выход из сервиса чата", "Авторизация");
        });
      }
      dispatch({ type: ACTION_NAMES.userSignOut });
      NotificationManager.success("Успешный выход из системы!");
      navigate(Route.home);
    } catch (e) {
      console.log(e);
      NotificationManager.error("Выход из системы", "Авторизация");
      navigate(-1);
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    onSignOut();
  }, [onSignOut]);

  return <Outlet />;
};
