import React from "react";

import { Grid } from "@mui/material";
import { Navbar } from "components/layout/Navbar";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <Grid container columnSpacing={10}>
      <Navbar />
      <Outlet />
    </Grid>
  );
};
