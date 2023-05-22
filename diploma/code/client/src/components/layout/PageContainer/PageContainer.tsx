import React, { CSSProperties } from "react";
import { Grid } from "@mui/material";
import { isMobile } from "react-device-detect";

export const PageContainer = ({
  children,
  className,
  style,
}: {
  children?: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}) => {
  return (
    <Grid item xs={isMobile ? 12 : 10} sx={{ marginTop: "60px" }}>
      <Grid item xs={12} className={className} style={style}>
        {children}
      </Grid>
    </Grid>
  );
};
