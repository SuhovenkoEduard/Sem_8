import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { APP_ROUTES } from "components/routing/constants";
import { CircularProgress } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "firebase_config";

export const ProtectedRoutes = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <CircularProgress />;
  }

  return user !== null ? <Outlet /> : <Navigate replace to={APP_ROUTES.auth} />;
};
