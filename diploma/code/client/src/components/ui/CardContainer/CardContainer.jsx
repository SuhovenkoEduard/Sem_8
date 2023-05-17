import React from "react";
import { Card } from "@mui/material";

import "./card-container.scss";

export const CardContainer = (props) => {
  return (
    <Card {...props} className={"card-container" + (props.className ?  " " + props.className : "")}>
      {props.children}
    </Card>
  )
};
