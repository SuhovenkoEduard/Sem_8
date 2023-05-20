import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Route } from "components/routing/constants";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "firebase_config";

export const PublicRoutes = () => {
  const [authUser] = useAuthState(auth);

  return authUser ? <Navigate replace to={Route.profile} /> : <Outlet />;
};
