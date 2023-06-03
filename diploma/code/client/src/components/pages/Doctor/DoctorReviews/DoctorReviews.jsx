import React, { useMemo, useState } from "react";
import { CardContainer } from "../../../ui/CardContainer";

import Paper from "@mui/material/Paper";
import {
  Button,
  IconButton,
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
import { EditButton } from "../../../ui/EditButton";
import { useSelector } from "react-redux";
import { getUserIdSelector } from "../../../../store/selectors";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";

import "./doctor-reviews.scss";

export const DoctorReviews = ({ reviews, editReview, deleteReview }) => {
  const userId = useSelector(getUserIdSelector);

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

  const sortedReviews = useMemo(() => {
    const firstReview = [reviews.find((review) => review.reviewer === userId)];
    const restReviews = reviews.filter((review) => review.reviewer !== userId);
    return [
      ...firstReview.filter(Boolean),
      ...restReviews.sort((leftReview, rightReview) =>
        dayjs(leftReview.createdAt).diff(dayjs(rightReview.createdAt), "second")
      ),
    ];
  }, [reviews, userId]);

  return (
    <CardContainer className="doctor-reviews">
      {isLoading || !users.length ? (
        <LoadingSpinner />
      ) : (
        <TableContainer component={Paper}>
          <Typography sx={{ textAlign: "center" }} variant="h6">
            Отзывы
          </Typography>
          {!sortedReviews.find((review) => review.reviewer === userId) && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                color="success"
                variant="contained"
                onClick={() => editReview(null)}
              >
                Добавить отзыв
              </Button>
            </div>
          )}
          <Table sx={{ maxWidth: 900 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Оценка</TableCell>
                <TableCell>Дата</TableCell>
                <TableCell>Пациент</TableCell>
                <TableCell>Отзыв</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedReviews.map((review) => {
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
                    <TableCell>
                      {review.reviewer === userId && (
                        <div style={{ display: "flex", gap: "10px" }}>
                          <EditButton onClick={() => editReview(review)} />
                          <IconButton
                            color="error"
                            onClick={() => deleteReview(review)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      )}
                    </TableCell>
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
