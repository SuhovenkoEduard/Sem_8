import React from "react";
import { Grid } from "@mui/material";
import { isMobile } from "react-device-detect";

export const PageContainer = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <Grid item xs={isMobile ? 12 : 10} sx={{ marginTop: "60px" }}>
      <Grid item xs={12} className={className}>
        {children}
      </Grid>
    </Grid>
  );
};
