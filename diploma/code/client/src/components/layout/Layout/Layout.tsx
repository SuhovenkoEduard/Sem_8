import React, { useState } from "react";

import { Grid } from "@mui/material";
import { Navbar } from "components/layout/Navbar";
import { matchPath, Outlet, useLocation } from "react-router-dom";
import { AppTitle } from "components/layout/AppTitle";
import { isMobile } from "react-device-detect";
import { Route, RouteTitles } from "components/routing/constants";

const findRoute = (path: string): Route =>
  Object.values(Route)
    .filter((route) => matchPath(route, path))
    .at(-1) as Route;

export const Layout = () => {
  const location = useLocation();
  const currentRoute = findRoute(location.pathname);
  const title = RouteTitles[currentRoute];
  const [isNavBarOpened, setIsNavBarOpened] = useState<boolean>(!isMobile);
  return (
    <Grid container columnSpacing={10}>
      <AppTitle
        title={title}
        isNavBarOpened={isNavBarOpened}
        setIsNavBarOpened={setIsNavBarOpened}
      />
      <Navbar
        isNavBarOpened={isNavBarOpened}
        setIsNavBarOpened={setIsNavBarOpened}
      />
      <Outlet />
    </Grid>
  );
};
