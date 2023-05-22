import React, { Suspense } from "react";
import {
  Navigate,
  Route as DomRoute,
  Routes as RoutesContainer,
} from "react-router-dom";
import { ProtectedRoutes } from "components/routing/ProtectedRoutes";
import { Route } from "components/routing/constants";
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
  DialogsPage,
  StatisticsPage,
  ThematicMaterialsPage,
  ThematicMaterialPage,
} from "components/pages";
import { RolesCheckRoutes } from "components/routing/RoleCheckRoutes";
import { Role } from "firestore/types/collections.types";

// const Home = React.lazy(() => import("components/pages/Home"));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RoutesContainer>
        {/* Protected routes */}
        <DomRoute element={<ProtectedRoutes />}>
          {/* Profile */}
          <DomRoute element={<RolesCheckRoutes roles={Object.values(Role)} />}>
            <DomRoute path={Route.profile} element={<Profile />} />
          </DomRoute>
          <DomRoute element={<RolesCheckRoutes roles={[Role.PATIENT]} />}>
            <DomRoute path={Route.diary} element={<DiaryPage />} />
          </DomRoute>
          <DomRoute
            element={<RolesCheckRoutes roles={[Role.PATIENT, Role.DOCTOR]} />}
          >
            <DomRoute path={Route.dialogs} element={<DialogsPage />} />
          </DomRoute>
          <DomRoute element={<RolesCheckRoutes roles={[Role.PATIENT]} />}>
            <DomRoute path={Route.statistics} element={<StatisticsPage />} />
          </DomRoute>
          <DomRoute element={<RolesCheckRoutes roles={[Role.RELATIVE]} />}>
            <DomRoute
              path={Route.relativeStatistics}
              element={<StatisticsPage />}
            />
          </DomRoute>
          <DomRoute element={<RolesCheckRoutes roles={[Role.DOCTOR]} />}>
            <DomRoute
              path={Route.patientsStatistics}
              element={<StatisticsPage />}
            />
          </DomRoute>
          <DomRoute
            element={
              <RolesCheckRoutes
                roles={[
                  Role.PATIENT,
                  Role.RELATIVE,
                  Role.DOCTOR,
                  Role.CONTENT_MAKER,
                  Role.MODERATOR,
                ]}
              />
            }
          >
            <DomRoute
              path={Route.thematicMaterials}
              element={<ThematicMaterialsPage />}
            />
            <DomRoute
              path={Route.thematicMaterial}
              element={<ThematicMaterialPage />}
            />
          </DomRoute>
        </DomRoute>
        {/* Default "/" */}
        <DomRoute
          path={Route.default}
          element={<Navigate replace to={Route.home} />}
        />
        {/* Home */}
        <DomRoute path={Route.home} element={<Home />} />
        <DomRoute element={<PublicRoutes />}>
          {/* auth: sign-in, sign-up */}
          <DomRoute
            path={Route.auth}
            element={<Navigate replace to={Route.signIn} />}
          />
          <DomRoute path={Route.signIn} element={<SignIn />} />
          <DomRoute path={Route.signUp} element={<SignUp />} />
        </DomRoute>
        {/* Sign out */}
        <DomRoute path={Route.signOut} element={<SignOut />} />
        {/* not found */}
        <DomRoute path={Route.notFound} element={<NotFound />} />
        {/* any */}
        <DomRoute path={Route.any} element={<NotFound />} />
      </RoutesContainer>
    </Suspense>
  );
};
