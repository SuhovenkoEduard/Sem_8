import * as React from "react";
import { CircularProgress } from "@mui/material";

import "./loading-spinner.scss";

export const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-container">
      <CircularProgress />
    </div>
  );
};
