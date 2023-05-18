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
  DiaryPage,
  Dialogs,
  Statistics,
} from "components/pages";
import { RolesCheckRoutes } from "components/routing/RoleCheckRoutes";
import { Role } from "firestore/types/collections.types";

// const Home = React.lazy(() => import("components/pages/Home"));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RoutesContainer>
        {/* Protected routes */}
        <Route element={<ProtectedRoutes />}>
          {/* Profile */}
          <Route element={<RolesCheckRoutes roles={Object.values(Role)} />}>
            <Route path={Routes.profile} element={<Profile />} />
          </Route>
          <Route element={<RolesCheckRoutes roles={[Role.PATIENT]} />}>
            <Route path={Routes.diary} element={<DiaryPage />} />
          </Route>
          <Route
            element={<RolesCheckRoutes roles={[Role.PATIENT, Role.DOCTOR]} />}
          >
            <Route path={Routes.dialogs} element={<Dialogs />} />
          </Route>
          <Route
            element={<RolesCheckRoutes roles={[Role.PATIENT, Role.RELATIVE]} />}
          >
            <Route path={Routes.statistics} element={<Statistics />} />
          </Route>
          {/* Sign out */}
          <Route path={Routes.signOut} element={<SignOut />} />
        </Route>
        {/* Default "/" */}
        <Route
          path={Routes.default}
          element={<Navigate replace to={Routes.home} />}
        />
        {/* Home */}
        <Route path={Routes.home} element={<Home />} />
        <Route element={<PublicRoutes />}>
          {/* auth: sign-in, sign-up */}
          <Route
            path={Routes.auth}
            element={<Navigate replace to={Routes.signIn} />}
          />
          <Route path={Routes.signIn} element={<SignIn />} />
          <Route path={Routes.signUp} element={<SignUp />} />
        </Route>
        {/* not found */}
        <Route path={Routes.notFound} element={<NotFound />} />
        {/* any */}
        <Route path={Routes.any} element={<NotFound />} />
      </RoutesContainer>
    </Suspense>
  );
};
