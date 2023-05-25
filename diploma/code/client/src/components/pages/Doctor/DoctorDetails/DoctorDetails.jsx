import React from "react";
import { DoctorDescription } from "../DoctorDescription";
import { DoctorReviews } from "../DoctorReviews";

import "./doctor-details.scss";

export const DoctorDetails = ({ doctor }) => {
  return (
    <div className="doctor-details">
      <DoctorDescription doctor={doctor} />
      <DoctorReviews reviews={doctor.employee.reviews} />
    </div>
  );
};
