import React from "react";
import { PageContainer } from "../../layout";
import { DoctorReviews } from "../Doctor/DoctorReviews";
import { getUserSelector } from "../../../store/selectors";
import { useSelector } from "react-redux";

import "./reviews.scss";
import { CardContainer } from "../../ui/CardContainer";
import Typography from "@mui/material/Typography";
import ReactStars from "react-stars/dist/react-stars";

export const ReviewsPage = () => {
  const user = useSelector(getUserSelector);
  return (
    <PageContainer className="reviews-page">
      <CardContainer className="score">
        <Typography variant="h5">Средняя оценка</Typography>
        <Typography>
          <ReactStars
            edit={false}
            size={50}
            value={
              user.employee.reviews
                .map(({ score }) => score)
                .reduce((a, b) => a + b, 0) / user.employee.reviews.length
            }
          />
        </Typography>
      </CardContainer>
      <DoctorReviews reviews={user.employee.reviews} />
    </PageContainer>
  );
};
