import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Routes } from "components/routing/constants";
import { useSelector } from "react-redux";
import { GlobalState } from "store";
import { Role, User } from "firestore/types/collections.types";

export const RolesCheckRoutes = ({ roles }: { roles: Role[] }) => {
  const user = useSelector<GlobalState, User>(
    (state) => state.currentUser.user as User
  );

  return !roles.includes(user.role) ? (
    <Navigate replace to={Routes.notFound} />
  ) : (
    <Outlet />
  );
};
