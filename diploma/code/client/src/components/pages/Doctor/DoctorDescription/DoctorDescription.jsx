import React from "react";
import Typography from "@mui/material/Typography";
import { CardContainer } from "../../../ui/CardContainer";
import { isMobile } from "react-device-detect";

export const DoctorDescription = ({ doctor }) => {
  return (
    <CardContainer sx={{ width: isMobile ? undefined : "900px", padding: "20px" }}>
      <Typography sx={{ textAlign: "center" }} variant="h6">
        Описание
      </Typography>
      <Typography>{doctor.employee.description}</Typography>
    </CardContainer>
  );
};
