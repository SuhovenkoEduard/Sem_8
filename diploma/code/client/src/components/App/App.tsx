import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";
import { NotificationContainer } from "react-notifications";
import { AppRoutes } from "components/routing";
import { auth } from "firebase_config";
import { useAppDispatch } from "store/store";
import { setUser } from "store/reducers/user/userSlice.tmp";

import "./app.scss";

export const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch(setUser(user?.toJSON() ?? null));
    });
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <div className="App">
      <AppRoutes />
      <NotificationContainer />
    </div>
  );
};
