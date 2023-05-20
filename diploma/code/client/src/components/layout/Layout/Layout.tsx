import React, { useState } from "react";

import { Grid } from "@mui/material";
import { Navbar } from "components/layout/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import { AppTitle } from "components/layout/AppTitle";
import { isMobile } from "react-device-detect";
import { Routes, RoutesTitles } from "components/routing/constants";

export const Layout = () => {
  const location = useLocation();
  const title = RoutesTitles[location.pathname as Routes];
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
