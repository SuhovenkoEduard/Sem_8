import React, { useMemo } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { CardContainer } from "../../../../ui/CardContainer";
import { convertDailyLogPropNameToMeasurement } from "../../../../../firestore/converters";

import "./recommendation-details-modal.scss";
import Typography from "@mui/material/Typography";
import { formatDate } from "../../../../../helpers/helpers";

export const RecommendationDetailsModal = ({
  isOpen,
  onClose,
  recommendation,
}) => {
  const healthStates = useMemo(() => {
    if (recommendation?.healthStates) {
      return recommendation.healthStates;
    }
    return [];
  }, [recommendation]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="recommendation-details-dialog"
    >
      <DialogTitle sx={{ textAlign: "center", marginBottom: "-10px" }}>
        Подробности рекомендации
      </DialogTitle>
      <DialogContent
        className="modal-content"
        sx={{
          paddingBottom: "20px",
          minWidth: "400px",
          maxWidth: "1400px",
          overflowY: "auto",
        }}
      >
        <div className="recommendation-details-modal-content">
          <div
            style={{
              margin: "0 auto",
              p: 1,
              width: "300px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{ textAlign: "center" }}
              variant="h6"
              component="div"
            >
              Дата
            </Typography>
            <CardContainer
              style={{ padding: "5px", width: "250px", textAlign: "center" }}
            >
              {Boolean(recommendation?.createdAt) &&
                formatDate(recommendation?.createdAt)}
            </CardContainer>
          </div>
          <Typography
            sx={{ textAlign: "center", marginTop: "10px" }}
            variant="h6"
            component="div"
          >
            Назначения
          </Typography>
          {!Boolean(healthStates.length) && (
            <CardContainer
              style={{
                padding: "10px",
                textAlign: "center",
              }}
            >
              Назначений нет.
            </CardContainer>
          )}
          {Boolean(healthStates.length) && (
            <TableContainer component={CardContainer}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Название</TableCell>
                    <TableCell sx={{ minWidth: "120px" }}>Минимум</TableCell>
                    <TableCell sx={{ minWidth: "120px" }}>Максимум</TableCell>
                    <TableCell>Предупреждение</TableCell>
                    <TableCell>Назначение</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {healthStates.map((healthState) => (
                    <TableRow
                      key={healthState.docId}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell>{healthState.title}</TableCell>
                      <TableCell>
                        {healthState.min}{" "}
                        {convertDailyLogPropNameToMeasurement(
                          healthState.propName
                        )}
                      </TableCell>
                      <TableCell>
                        {healthState.max}{" "}
                        {convertDailyLogPropNameToMeasurement(
                          healthState.propName
                        )}
                      </TableCell>
                      <TableCell>{healthState.warning}</TableCell>
                      <TableCell>{healthState.recommendation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <div
            style={{
              margin: "20px auto",
              p: 1,
              width: "300px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{ textAlign: "center" }}
              variant="h6"
              component="div"
            >
              Комментарий
            </Typography>
            <CardContainer
              style={{ padding: "5px", width: "250px", textAlign: "center" }}
            >
              {Boolean(recommendation?.comment)
                ? recommendation?.comment
                : "Комментарий пуст."}
            </CardContainer>
          </div>
        </div>
      </DialogContent>
      <DialogActions className="controls">
        <Button onClick={onClose} variant="outlined">
          Отмена
        </Button>
      </DialogActions>
    </Dialog>
  );
};
