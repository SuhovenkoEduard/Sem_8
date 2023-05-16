import React from "react";
import { Grid } from "@mui/material";
import { isMobile } from "react-device-detect";

export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Grid item xs={isMobile ? 12 : 10}>
      <Grid container>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </Grid>
  );
};
