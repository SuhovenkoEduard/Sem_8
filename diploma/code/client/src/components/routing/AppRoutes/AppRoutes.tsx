import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoutes } from "components/routing/ProtectedRoutes";
import { APP_ROUTES } from "components/routing/constants";
import { Home, NotFound, Profile, SignIn, SignUp } from "components/pages";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Protected routes */}
      <Route path={APP_ROUTES.default} element={<ProtectedRoutes />}>
        <Route
          path={APP_ROUTES.default}
          element={<Navigate replace to={APP_ROUTES.profile} />}
        />
        <Route path={APP_ROUTES.profile} element={<Profile />} />
      </Route>
      {/* Home */}
      <Route path={APP_ROUTES.home} element={<Home />} />
      {/* auth: sign-in, sign-up */}
      <Route
        path={APP_ROUTES.auth}
        element={<Navigate replace to={APP_ROUTES.signIn} />}
      />
      <Route path={APP_ROUTES.signIn} element={<SignIn />} />
      <Route path={APP_ROUTES.signUp} element={<SignUp />} />
      {/*<Route path={APP_ROUTES.auth} element={<PublicRoutes />}>*/}
      {/*</Route>*/}
      <Route path={APP_ROUTES.any} element={<NotFound />} />
    </Routes>
  );
};
