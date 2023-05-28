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

import "./recommendation-modal.scss";
import { HealthStatesChip } from "./HealthStatesChip";

const INITIAL_RECOMMENDATION = {
  createdAt: "",
  healthStates: [],
  comment: "",
  patientReply: null,
};

const copyRecommendation = (recommendation) => {
  return {
    ...deepCopy(recommendation),
    healthStates: recommendation.healthStates.map(({ docId }) => docId),
  };
};

export const RecommendationModal = ({
  isOpen,
  onClose,
  submitRecommendation,
  selectedRecommendation,
  healthStates,
}) => {
  const getRecommendation = useCallback(
    () =>
      selectedRecommendation
        ? copyRecommendation(selectedRecommendation)
        : { ...INITIAL_RECOMMENDATION, createdAt: new Date().toString() },
    [selectedRecommendation]
  );

  const [recommendation, setRecommendation] = useState(getRecommendation());
  const [isLoading, setIsLoading] = useState(false);

  const resetRecommendation = useCallback(() => {
    setRecommendation(getRecommendation());
  }, [setRecommendation, getRecommendation]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setRecommendation((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitRecommendation = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    await submitRecommendation({
      ...recommendation,
      healthStates: recommendation.healthStates.map((id) =>
        healthStates.find(({ docId }) => docId === id)
      ),
      createdAt: dayjs().toDate().toString(),
    });
    setIsLoading(false);
    onClose();
  };

  useEffect(() => {
    resetRecommendation();
  }, [selectedRecommendation, isOpen, resetRecommendation]);

  const areEqual = (left, right) => {
    const withoutCreatedAtLeft = { ...left, createdAt: undefined };
    const withoutCreatedAtRight = { ...right, createdAt: undefined };
    return (
      JSON.stringify(withoutCreatedAtLeft) ===
      JSON.stringify(withoutCreatedAtRight)
    );
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        {(selectedRecommendation ? "Редактирование" : "Добавление") +
          " рекомендации"}
      </DialogTitle>
      <DialogContent
        className="modal-content"
        sx={{
          width: isMobile ? "300px" : "600px",
        }}
      >
        <form
          className="recommendation-form"
          onSubmit={handleSubmitRecommendation}
        >
          <TextField
            label="Дата"
            name="createdAt"
            value={formatDate(recommendation.createdAt)}
            disabled={true}
            fullWidth
          />
          <HealthStatesChip
            healthStatesOptions={healthStates}
            healthStates={recommendation.healthStates}
            setHealthStates={(newHealthStates) =>
              setRecommendation({
                ...recommendation,
                healthStates: newHealthStates,
              })
            }
          />
          <TextField
            multiline
            minRows={3}
            maxRows={3}
            label="Комментарий"
            name="comment"
            value={recommendation.comment}
            onChange={handleFieldChange}
            disabled={isLoading}
            fullWidth
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
                  (selectedRecommendation &&
                    areEqual(
                      recommendation,
                      copyRecommendation(selectedRecommendation)
                    )) ||
                  areEqual(recommendation, INITIAL_RECOMMENDATION)
                }
                autoFocus
              >
                {selectedRecommendation ? "Изменить" : "Добавить"}
              </Button>
            )}
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
