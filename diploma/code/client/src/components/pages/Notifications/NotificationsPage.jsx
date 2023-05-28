import React, { useMemo, useState } from "react";
import { PageContainer } from "../../layout";
import { useGeneralDataHook } from "../../../hooks/useGeneralDataHook";
import { firebaseRepositories } from "../../../firestore/data/repositories";
import { LoadingSpinner } from "../../ui/LoadingSpinner";

import "./notifications.scss";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {
  convertDailyLogPropNameToMeasurement,
  convertDailyLogPropNameToRussian,
  convertUserToUserInfo,
} from "../../../firestore/converters";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { formatDate } from "../../../helpers/helpers";
import { CardContainer } from "../../ui/CardContainer";
import { and, where } from "firebase/firestore";
import { Role } from "../../../firestore/types/collections.types";
import Avatar from "@mui/material/Avatar";
import { getUserFullName } from "../../../firestore/helpers";
import { RecommendationModal } from "./components/RecommendationModal";

const getHealthStatesByPatientReports = (patientReports, healthStates) =>
  patientReports
    .map(({ currentValue, propName: reportPropName }) =>
      healthStates.filter(
        ({ min, max, propName }) =>
          propName === reportPropName &&
          min <= currentValue &&
          currentValue <= max
      )
    )
    .flat();

export const NotificationsPage = () => {
  const [isNotificationsLoading, notifications, resetNotifications] =
    useGeneralDataHook(
      async () => await firebaseRepositories.notifications.getDocs(),
      []
    );

  const [isPatientsLoading, patients] = useGeneralDataHook(async () => {
    if (!notifications || !notifications.length) {
      return;
    }
    return (
      await firebaseRepositories.users.getDocs(
        and(
          where("role", "==", Role.PATIENT),
          where(
            "docId",
            "in",
            notifications.map(({ patient }) => patient)
          )
        )
      )
    ).map(convertUserToUserInfo);
  }, [notifications]);

  const [isHealthStatesLoading, healthStates] = useGeneralDataHook(
    async () => await firebaseRepositories.healthStates.getDocs(),
    []
  );

  const isLoading = useMemo(
    () => isNotificationsLoading || isPatientsLoading || isHealthStatesLoading,
    [isNotificationsLoading, isPatientsLoading, isHealthStatesLoading]
  );

  // recommendation modal
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [selectedHealthStates, setSelectedHealthStates] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const submitRecommendation = async (recommendation) => {
    await firebaseRepositories.notifications.updateDoc({
      ...selectedNotification,
      recommendation,
    });
    await resetNotifications();
  };

  const onDeleteRecommendation = async (notification) => {
    await firebaseRepositories.notifications.updateDoc({
      ...notification,
      recommendation: null,
    });
    await resetNotifications();
  };

  const onOpen = (notification) => {
    setSelectedHealthStates(
      getHealthStatesByPatientReports(notification.patientReports, healthStates)
    );
    setSelectedNotification(notification);
    setIsOpen(true);
  };

  const onClose = () => {
    setSelectedHealthStates([]);
    setSelectedNotification(null);
    setIsOpen(false);
  };

  return (
    <PageContainer className="notifications-page">
      {isLoading && <LoadingSpinner />}
      {!isLoading && notifications && !notifications.length && (
        <div className="no-notifications">Нет уведомлений</div>
      )}
      {!isLoading &&
        notifications &&
        patients &&
        healthStates &&
        notifications.length &&
        patients.length &&
        healthStates.length && (
          <CardContainer className="notifications-container">
            <TableContainer component={Paper}>
              <Typography sx={{ textAlign: "center" }} variant="h6">
                Уведомления
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Дата</TableCell>
                    <TableCell>Пациент</TableCell>
                    <TableCell>Детали</TableCell>
                    <TableCell>Рекомендация</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {notifications.map((notification) => {
                    const patient = patients.find(
                      (patient) => notification.patient === patient.docId
                    );
                    return (
                      <TableRow
                        key={notification.docId}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>
                          {formatDate(notification.createdAt)}
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
                              src={patient.imageUrl}
                              alt={getUserFullName(patient)}
                            />
                            <Typography noWrap>
                              {getUserFullName(patient)}
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell sx={{ minWidth: "300px" }}>
                          <div className="notification-details">
                            {notification.patientReports.map(
                              (patientReport) => (
                                <CardContainer
                                  className="patient-report"
                                  key={
                                    notification.docId + patientReport.propName
                                  }
                                >
                                  <div className="prop-name">
                                    {convertDailyLogPropNameToRussian(
                                      patientReport.propName
                                    )}
                                    :
                                  </div>
                                  <div className="current-value">
                                    {patientReport.currentValue}{" "}
                                    {convertDailyLogPropNameToMeasurement(
                                      patientReport.propName
                                    )}
                                  </div>
                                </CardContainer>
                              )
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {notification.recommendation && (
                            <div className="controls">
                              <Button
                                variant="contained"
                                color="info"
                                // onClick={() => onOpenEdit(healthState)}
                              >
                                Детали
                              </Button>
                              <Button
                                variant="contained"
                                color="warning"
                                onClick={() => onOpen(notification)}
                              >
                                Редактировать
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() =>
                                  onDeleteRecommendation(notification)
                                }
                              >
                                Удалить
                              </Button>
                            </div>
                          )}
                          {!notification.recommendation && (
                            <Button
                              variant="contained"
                              color="info"
                              sx={{ width: "150px " }}
                              onClick={() => onOpen(notification)}
                            >
                              Добавить рекомендацию
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContainer>
        )}
      <RecommendationModal
        isOpen={isOpen}
        onClose={onClose}
        submitRecommendation={submitRecommendation}
        selectedRecommendation={selectedNotification?.recommendation ?? null}
        healthStates={selectedHealthStates}
      />
    </PageContainer>
  );
};
