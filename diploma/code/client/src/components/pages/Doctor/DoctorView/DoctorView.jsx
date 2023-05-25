import React from "react";
import { getUserFullName } from "../../../../firestore/helpers";
import ReactStars from "react-stars";
import { CardContainer } from "../../../ui/CardContainer";

export const DoctorView = ({ doctor }) => {
  return (
    <CardContainer className="doctor-view" sx={{ padding: "10px" }}>
      <div className="avatar">
        <img
          src={doctor.imageUrl}
          alt="doctor avatar"
          width="200px"
          height="200px"
        />
      </div>
      <div className="fullname">{getUserFullName(doctor)}</div>
      <div className="score">{doctor.score}</div>
      <ReactStars
        edit={false}
        size={24}
        value={
          doctor.employee.reviews
            .map(({ score }) => score)
            .reduce((a, b) => a + b, 0) / doctor.employee.reviews.length
        }
      />
    </CardContainer>
  );
};
