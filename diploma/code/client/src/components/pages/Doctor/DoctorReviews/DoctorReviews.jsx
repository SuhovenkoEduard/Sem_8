import React, { useState } from "react";
import { CardContainer } from "../../../ui/CardContainer";

import "./doctor-reviews.scss";
import Paper from "@mui/material/Paper";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { formatDate } from "../../../../helpers/helpers";
import useAsyncEffect from "use-async-effect";
import { NotificationManager } from "react-notifications";
import { firebaseRepositories } from "../../../../firestore/data/repositories";
import { LoadingSpinner } from "../../../ui/LoadingSpinner";
import Typography from "@mui/material/Typography";
import { getUserFullName } from "../../../../firestore/helpers";
import Avatar from "@mui/material/Avatar";
import ReactStars from "react-stars/dist/react-stars";

export const DoctorReviews = ({ reviews }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  useAsyncEffect(async () => {
    try {
      setIsLoading(true);
      const newUsers = await firebaseRepositories.users.getDocs();
      setUsers(newUsers);
    } catch (e) {
      console.log(e);
      NotificationManager.error(
        "Загрузка пользователей",
        "Таблица отзывов доктора"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <CardContainer className="doctor-reviews">
      {isLoading || !users.length ? (
        <LoadingSpinner />
      ) : (
        <TableContainer component={Paper}>
          <Typography sx={{ textAlign: "center" }} variant="h6">
            Отзывы
          </Typography>
          <Table sx={{ maxWidth: 900 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Оценка</TableCell>
                <TableCell>Дата</TableCell>
                <TableCell>Пациент</TableCell>
                <TableCell>Текст отзыва</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews.map((review) => {
                const reviewer = users.find(
                  (user) => user.docId === review.reviewer
                );
                return (
                  <TableRow
                    key={formatDate(review.createdAt)}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell sx={{ minWidth: 100 }}>
                      <ReactStars value={review.score} edit={false} />
                    </TableCell>
                    <TableCell sx={{ minWidth: 200 }}>
                      {formatDate(review.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "center",
                        }}
                      >
                        <Avatar
                          src={reviewer.imageUrl}
                          alt={getUserFullName(reviewer)}
                        />
                        <Typography noWrap>
                          {getUserFullName(reviewer)}
                        </Typography>
                      </div>
                    </TableCell>
                    <TableCell>{review.content}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </CardContainer>
  );
};
