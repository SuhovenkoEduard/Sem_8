import React, { useMemo, useState } from "react";
import { PageContainer } from "../../layout";
import { useGeneralDataHook } from "../../../hooks/useGeneralDataHook";
import { firebaseRepositories } from "../../../firestore/data/repositories";
import { LoadingSpinner } from "../../ui/LoadingSpinner";

import "./notifications.scss";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { convertUserToUserInfo } from "../../../firestore/converters";
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
import { useSelector } from "react-redux";
import { getUserSelector } from "../../../store/selectors";
import dayjs from "dayjs";
import { Status } from "../Recommendations/components/Status/Status";
import { NotificationDetails } from "./components/NotificationDetails/NotificationDetails";
import { useGeneralModalHandlers } from "../../../hooks/useGeneralModalHandlers";
import { RecommendationDetailsModal } from "./components/RecommendationDetailsModal/RecommendationDetailsModal";

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
  const user = useSelector(getUserSelector);
  const [isNotificationsLoading, notifications, resetNotifications] =
    useGeneralDataHook(
      async () =>
        (
          await firebaseRepositories.notifications.getDocs(
            where("doctor", "==", user.docId)
          )
        ).sort(
          (a, b) => -dayjs(a.createdAt).diff(dayjs(b.createdAt), "second")
        ),
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
    async () => firebaseRepositories.healthStates.getDocs(),
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

  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [isRecModalOpened, openRecModal, closeRecModal] =
    useGeneralModalHandlers({
      onOpen: (recommendation) => {
        setSelectedRecommendation(recommendation);
      },
      onClose: () => {
        setSelectedRecommendation(null);
      },
    });

  return (
    <PageContainer className="notifications-page">
      {isLoading && <LoadingSpinner />}
      {!isLoading && notifications && !notifications.length && (
        <div className="no-notifications">Нет уведомлений</div>
      )}
      {!isLoading &&
        notifications != null &&
        patients != null &&
        healthStates != null &&
        !!notifications.length &&
        !!patients.length &&
        !!healthStates.length && (
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
                    <TableCell>Отклонения по показателям</TableCell>
                    <TableCell>Рекомендация</TableCell>
                    <TableCell>Ответ пациента</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {notifications.map((notification) => {
                    const patient = patients.find(
                      (currentPatient) =>
                        notification.patient === currentPatient.docId
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
                            <Typography>{getUserFullName(patient)}</Typography>
                          </div>
                        </TableCell>
                        <TableCell sx={{ minWidth: "300px" }}>
                          <NotificationDetails notification={notification} />
                        </TableCell>
                        <TableCell>
                          {notification?.recommendation && (
                            <CardContainer
                              sx={{
                                padding: "5px",
                                margin: "10px auto",
                                fontSize: "12px",
                              }}
                            >
                              Дата рекомендации:{" "}
                              {formatDate(
                                notification.recommendation.createdAt
                              )}
                            </CardContainer>
                          )}
                          {notification.recommendation && (
                            <div className="controls">
                              <div style={{ display: "flex", gap: "5px" }}>
                                <Button
                                  variant="contained"
                                  color="info"
                                  sx={{ fontSize: "11px", fontWeight: "bold" }}
                                  onClick={() =>
                                    openRecModal(notification?.recommendation)
                                  }
                                >
                                  Подробнее
                                </Button>
                                {!notification?.recommendation
                                  ?.patientReply && (
                                  <>
                                    <Button
                                      variant="contained"
                                      color="warning"
                                      sx={{
                                        fontSize: "11px",
                                        fontWeight: "bold",
                                      }}
                                      onClick={() => onOpen(notification)}
                                    >
                                      Редактировать
                                    </Button>
                                    <Button
                                      variant="contained"
                                      color="error"
                                      sx={{
                                        fontSize: "11px",
                                        fontWeight: "bold",
                                      }}
                                      onClick={() =>
                                        onDeleteRecommendation(notification)
                                      }
                                    >
                                      Удалить
                                    </Button>
                                  </>
                                )}
                              </div>
                              {notification?.recommendation?.patientReply && (
                                <div
                                  style={{
                                    fontSize: "12px",
                                    textAlign: "center",
                                  }}
                                >
                                  Изменение рекомендации, после ответа
                                  пользователя запрещено.
                                </div>
                              )}
                            </div>
                          )}
                          {!notification.recommendation && (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <Button
                                variant="contained"
                                color="info"
                                sx={{ fontSize: "11px", fontWeight: "bold" }}
                                onClick={() => onOpen(notification)}
                              >
                                Добавить рекомендацию
                              </Button>
                            </div>
                          )}
                        </TableCell>
                        <TableCell sx={{ minWidth: "270px" }}>
                          <Status notification={notification} />
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
      <RecommendationDetailsModal
        isOpen={isRecModalOpened}
        onClose={closeRecModal}
        recommendation={selectedRecommendation}
      />
    </PageContainer>
  );
};
