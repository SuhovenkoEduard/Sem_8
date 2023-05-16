import * as React from "react";
import { CircularProgress } from "@mui/material";

import "./loading-spinner.scss";

export const LoadingSpinner = ({ style }: { style?: React.CSSProperties }) => {
  return (
    <div className="loading-spinner-container" style={style}>
      <CircularProgress sx={{ margin: "auto" }} />
    </div>
  );
};
