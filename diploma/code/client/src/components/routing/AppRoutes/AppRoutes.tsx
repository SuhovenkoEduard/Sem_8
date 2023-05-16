import React, { Suspense } from "react";
import { Navigate, Route, Routes as RoutesContainer } from "react-router-dom";
import { ProtectedRoutes } from "components/routing/ProtectedRoutes";
import { Routes } from "components/routing/constants";
import { PublicRoutes } from "components/routing/PublicRoutes";
import { LoadingSpinner } from "components/ui/LoadingSpinner";
import {
  Home,
  NotFound,
  Profile,
  SignIn,
  SignUp,
  SignOut,
  Diary,
} from "components/pages";

// const Home = React.lazy(() => import("components/pages/Home"));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RoutesContainer>
        {/* Protected routes */}
        <Route path={Routes.default} element={<ProtectedRoutes />}>
          <Route
            path={Routes.default}
            element={<Navigate replace to={Routes.profile} />}
          />
          <Route path={Routes.profile} element={<Profile />} />
          <Route path={Routes.diary} element={<Diary />} />
        </Route>
        {/* Home */}
        <Route path={Routes.home} element={<Home />} />
        <Route path={Routes.default} element={<PublicRoutes />}>
          {/* auth: sign-in, sign-up */}
          <Route
            path={Routes.auth}
            element={<Navigate replace to={Routes.signIn} />}
          />
          <Route path={Routes.signIn} element={<SignIn />} />
          <Route path={Routes.signUp} element={<SignUp />} />
        </Route>
        {/* Sign out */}
        <Route path={Routes.signOut} element={<SignOut />} />
        {/* any */}
        <Route path={Routes.any} element={<NotFound />} />
      </RoutesContainer>
    </Suspense>
  );
};
