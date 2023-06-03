import React from "react";
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

import "./health-state-modal.scss";
import Paper from "@mui/material/Paper";
import { convertDailyLogPropNameToMeasurement } from "../../../../../firestore/converters";

export const HealthStateModal = ({ isOpen, onClose, healthStates }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle sx={{ textAlign: "center", marginBottom: "-20px" }}>
        Назначения
      </DialogTitle>
      <DialogContent className="modal-content" sx={{ width: "1400px" }}>
        <CardContainer className="health-state-container">
          <TableContainer component={Paper}>
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
          <DialogActions className="controls">
            <Button onClick={onClose} variant="outlined">
              Отмена
            </Button>
          </DialogActions>
        </CardContainer>
      </DialogContent>
    </Dialog>
  );
};
