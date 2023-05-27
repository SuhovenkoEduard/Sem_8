import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { isMobile } from "react-device-detect";
import { LoadingSpinner } from "../../../ui/LoadingSpinner";
import { deepCopy } from "deep-copy-ts";
import { generateDocId } from "firestore/helpers";
import { convertDailyLogPropNameToRussian } from "../../../../firestore/converters";

export const HealthStateModal = ({
  isOpen,
  onClose,
  submitHealthState,
  healthStateToEdit,
  propName,
}) => {
  const getHealthState = useCallback(
    () =>
      healthStateToEdit
        ? deepCopy(healthStateToEdit)
        : {
            min: "",
            max: "",
            warning: "",
            recommendation: "",
          },
    [healthStateToEdit]
  );

  const [healthState, setHealthState] = useState(getHealthState());
  const [isLoading, setIsLoading] = useState(false);

  const resetHealthState = useCallback(() => {
    setHealthState(getHealthState());
  }, [setHealthState, getHealthState]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setHealthState((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitHealthState = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    await submitHealthState({
      docId: healthStateToEdit?.docId ?? generateDocId(),
      ...healthState,
      min: +healthState.min ?? 0,
      max: +healthState.max ?? 0,
      propName,
    });
    setIsLoading(false);
    onClose();
  };

  useEffect(resetHealthState, [healthStateToEdit, isOpen, resetHealthState]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        {(healthStateToEdit ? "Редактирование" : "Добавление") +
          " готовой рекомендации"}
      </DialogTitle>
      <DialogContent
        className="modal-content"
        sx={{
          width: isMobile ? "300px" : "600px",
        }}
      >
        <form
          className="health-state-form"
          style={{
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            gap: "20px",
            alignItems: "center",
          }}
          onSubmit={handleSubmitHealthState}
        >
          <TextField
            label="Показатель"
            name="propName"
            value={convertDailyLogPropNameToRussian(propName)}
            disabled={true}
            fullWidth
          />
          <TextField
            label="Минимум"
            name="min"
            value={healthState.min}
            onChange={handleFieldChange}
            disabled={isLoading}
            fullWidth
          />
          <TextField
            label="Минимум"
            name="max"
            value={healthState.max}
            onChange={handleFieldChange}
            disabled={isLoading}
            fullWidth
          />
          <TextField
            multiline
            minRows={3}
            maxRows={4}
            label="Предупреждение"
            name="warning"
            value={healthState.warning}
            onChange={handleFieldChange}
            disabled={isLoading}
            fullWidth
          />
          <TextField
            multiline
            minRows={3}
            maxRows={4}
            label="Рекоммендация"
            name="recommendation"
            value={healthState.recommendation}
            onChange={handleFieldChange}
            disabled={isLoading}
            fullWidth
          />
          <DialogActions
            className="controls"
            sx={{ width: "100%", display: "flex", alignItems: "flexEnd" }}
          >
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
                  healthStateToEdit?.warning === healthState.warning &&
                  healthStateToEdit?.recommendation ===
                    healthState.recommendation &&
                  healthStateToEdit?.min === healthState.min &&
                  healthStateToEdit?.max === healthState.max
                }
                autoFocus
              >
                {healthStateToEdit ? "Изменить" : "Добавить"}
              </Button>
            )}
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
