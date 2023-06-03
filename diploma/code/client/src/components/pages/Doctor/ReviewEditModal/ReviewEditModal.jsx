import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { LoadingSpinner } from "components/ui/LoadingSpinner";
import { deepCopy } from "deep-copy-ts";
import { formatDate } from "helpers/helpers";
import { isMobile } from "react-device-detect";
import dayjs from "dayjs";

import "./review-modal.scss";
import { useSelector } from "react-redux";
import { getUserInfoSelector } from "../../../../store/selectors";
import ReactStars from "react-stars";

export const ReviewEditModal = ({
  isOpen,
  onClose,
  submitReview,
  selectedReview,
}) => {
  const user = useSelector(getUserInfoSelector);

  const getReview = useCallback(
    () =>
      selectedReview
        ? deepCopy(selectedReview)
        : {
            createdAt: dayjs().toDate().toString(),
            score: 0,
            reviewer: user.docId,
            content: "",
          },
    [selectedReview, user.docId]
  );

  const [review, setReview] = useState(getReview());
  const [isLoading, setIsLoading] = useState(false);

  const resetReview = useCallback(() => {
    setReview(getReview());
  }, [setReview, getReview]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setReview((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitReview = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    await submitReview({
      ...review,
      createdAt: dayjs().toDate().toString(),
    });
    setIsLoading(false);
    onClose();
  };

  useEffect(() => {
    resetReview();
  }, [selectedReview, isOpen, resetReview]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        {(selectedReview ? "Редактирование" : "Добавление") + " отзыва"}
      </DialogTitle>
      <DialogContent
        className="modal-content"
        sx={{
          width: isMobile ? "300px" : "600px",
        }}
      >
        <form className="review-form" onSubmit={handleSubmitReview}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            Оценка:
            <ReactStars
              value={review.score}
              size={32}
              onChange={(value) =>
                handleFieldChange({ target: { name: "score", value } })
              }
            />
          </div>
          <TextField
            label="Дата"
            name="createdAt"
            value={formatDate(review.createdAt)}
            disabled={true}
          />
          <TextField
            multiline
            minRows={3}
            maxRows={3}
            label="Отзыв"
            name="content"
            value={review.content}
            onChange={handleFieldChange}
            disabled={isLoading}
          />
          <DialogActions className="controls">
            <Button onClick={onClose} disabled={isLoading} variant="outlined">
              Отмена
            </Button>
            {isLoading ? (
              <LoadingSpinner style={{ margin: "0", width: "100px" }} />
            ) : (
              <Button
                type="submit"
                variant="outlined"
                disabled={
                  selectedReview?.content === review.content &&
                  selectedReview?.score === review.score
                }
                autoFocus
              >
                {selectedReview ? "Изменить" : "Добавить"}
              </Button>
            )}
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
