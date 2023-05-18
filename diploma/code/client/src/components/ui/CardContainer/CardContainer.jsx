import React from "react";
import { Card, Typography } from "@mui/material";

import "./card-container.scss";

export const CardContainer = (props) => {
  return (
    <Card {...props} className={"card-container" + (props.className ?  " " + props.className : "")}>
      {props.title && (
        <Typography variant="h6" className="card-container-title">
          {props.title}
        </Typography>
      )}
      {props.children}
    </Card>
  )
};
