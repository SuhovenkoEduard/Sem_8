import React, { useMemo, useState } from "react";
import { PageContainer } from "../../layout";
import { firebaseRepositories } from "../../../firestore/data/repositories";
import { useGeneralDataHook } from "../../../hooks/useGeneralDataHook";
import { LoadingSpinner } from "../../ui/LoadingSpinner";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { convertDailyLogPropNameToRussian } from "../../../firestore/converters";
import { CardContainer } from "../../ui/CardContainer";

import "./health-states.scss";
import { HealthStateModal } from "./components/HealthStateModal";

export const HealthStatesPage = () => {
  const [isLoading, healthStates, reset] = useGeneralDataHook(
    async () => firebaseRepositories.healthStates.getDocs(),
    []
  );

  const groupedHealthStates = useMemo(() => {
    if (!healthStates) {
      return [];
    }
    return healthStates.reduce((acc, healthState) => {
      if (!acc[healthState.propName]) {
        acc[healthState.propName] = [];
      }
      acc[healthState.propName] = [...acc[healthState.propName], healthState];
      return acc;
    }, {});
  }, [healthStates]);

  // modal
  const [isOpen, setIsOpen] = useState(false);
  const [healthStateToEdit, setHealthStateToEdit] = useState(null);
  const [propName, setPropName] = useState(null);

  const submitHealthState = async (healthState) => {
    await firebaseRepositories.healthStates.updateDoc(healthState);
    await reset();
  };

  const deleteHealthState = async (healthState) => {
    await firebaseRepositories.healthStates.deleteDocById(healthState.docId);
    await reset();
  };

  const onOpenAdd = (_propName) => {
    setHealthStateToEdit(null);
    setPropName(_propName);
    setIsOpen(true);
  };

  const onOpenEdit = (healthState) => {
    setHealthStateToEdit(healthState);
    setPropName(healthState.propName);
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
    setHealthStateToEdit(null);
    setPropName(null);
  };

  return (
    <PageContainer className="health-states-page">
      {isLoading && <LoadingSpinner />}
      {!isLoading && Object.entries(groupedHealthStates).length && (
        <div className="health-states-container">
          {Object.entries(groupedHealthStates).map(
            ([_propName, _healthStates]) => (
              <CardContainer key={_propName}>
                <TableContainer component={Paper}>
                  <Typography sx={{ textAlign: "center" }} variant="h6">
                    {convertDailyLogPropNameToRussian(_propName)}
                  </Typography>
                  <div className="add-button">
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => onOpenAdd(_propName)}
                    >
                      Добавить
                    </Button>
                  </div>
                  <Table sx={{ maxWidth: 900 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Минимум</TableCell>
                        <TableCell>Максимум</TableCell>
                        <TableCell>Предупреждение</TableCell>
                        <TableCell>Рекомендация</TableCell>
                        <TableCell>Управление</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {_healthStates.map((healthState) => (
                        <TableRow
                          key={healthState.docId}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell>{healthState.min}</TableCell>
                          <TableCell>{healthState.max}</TableCell>
                          <TableCell>{healthState.warning}</TableCell>
                          <TableCell>{healthState.recommendation}</TableCell>
                          <TableCell>
                            <div className="controls">
                              <Button
                                variant="contained"
                                color="warning"
                                onClick={() => onOpenEdit(healthState)}
                              >
                                Редактировать
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => deleteHealthState(healthState)}
                              >
                                Удалить
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContainer>
            )
          )}
        </div>
      )}
      <HealthStateModal
        isOpen={isOpen}
        onClose={onClose}
        submitHealthState={submitHealthState}
        healthStateToEdit={healthStateToEdit}
        propName={propName}
      />
    </PageContainer>
  );
};
