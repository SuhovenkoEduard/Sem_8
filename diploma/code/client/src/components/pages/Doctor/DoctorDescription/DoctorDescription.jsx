import React from "react";
import Typography from "@mui/material/Typography";
import { CardContainer } from "../../../ui/CardContainer";

export const DoctorDescription = ({ doctor }) => {
  return (
    <CardContainer sx={{ width: "900px", padding: "20px" }}>
      <Typography sx={{ textAlign: "center" }} variant="h6">
        Описание
      </Typography>
      <Typography>{doctor.employee.description}</Typography>
    </CardContainer>
  );
};
