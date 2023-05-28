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
  DialogsPage,
  DiaryPage,
  DoctorPage,
  HealthStatesPage,
  Home,
  NotFound,
  Profile,
  RelativePage,
  SignIn,
  SignOut,
  SignUp,
  StatisticsPage,
  ThematicMaterialPage,
  ThematicMaterialsPage,
  ReviewsPage,
  NotificationsPage,
  RecommendationsPage,
} from "components/pages";
import { RolesCheckRoutes } from "components/routing/RoleCheckRoutes";
import { Role } from "firestore/types/collections.types";

// const HomePage = React.lazy(() => import("components/pages/HomePage"));

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
          <DomRoute
            element={<RolesCheckRoutes roles={[Role.PATIENT, Role.RELATIVE]} />}
          >
            <DomRoute path={Route.relative} element={<RelativePage />} />
          </DomRoute>
          <DomRoute element={<RolesCheckRoutes roles={[Role.PATIENT]} />}>
            <DomRoute path={Route.doctor} element={<DoctorPage />} />
          </DomRoute>
          <DomRoute element={<RolesCheckRoutes roles={[Role.DOCTOR]} />}>
            <DomRoute path={Route.reviews} element={<ReviewsPage />} />
          </DomRoute>
          <DomRoute element={<RolesCheckRoutes roles={[Role.DOCTOR]} />}>
            <DomRoute
              path={Route.healthStates}
              element={<HealthStatesPage />}
            />
          </DomRoute>
          <DomRoute element={<RolesCheckRoutes roles={[Role.DOCTOR]} />}>
            <DomRoute
              path={Route.notifications}
              element={<NotificationsPage />}
            />
          </DomRoute>
          <DomRoute element={<RolesCheckRoutes roles={[Role.PATIENT]} />}>
            <DomRoute
              path={Route.recommendations}
              element={<RecommendationsPage />}
            />
          </DomRoute>
          {/* Sign out */}
          <DomRoute path={Route.signOut} element={<SignOut />} />
        </DomRoute>
        {/* Default "/" */}
        <DomRoute
          path={Route.default}
          element={<Navigate replace to={Route.home} />}
        />
        {/* HomePage */}
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
        {/* not found */}
        <DomRoute path={Route.notFound} element={<NotFound />} />
        {/* any */}
        <DomRoute path={Route.any} element={<NotFound />} />
      </RoutesContainer>
    </Suspense>
  );
};
