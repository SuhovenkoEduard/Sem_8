import React, { useMemo, useState } from "react";

import "./recommendations.scss";
import { firebaseRepositories } from "../../../firestore/data/repositories";
import { useGeneralDataHook } from "../../../hooks/useGeneralDataHook";
import { useSelector } from "react-redux";
import { getUserSelector } from "../../../store/selectors";
import { where } from "firebase/firestore";
import { PageContainer } from "../../layout";
import { LoadingSpinner } from "../../ui/LoadingSpinner";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { formatDate } from "../../../helpers/helpers";
import Avatar from "@mui/material/Avatar";
import { getUserFullName } from "../../../firestore/helpers";
import { CardContainer } from "../../ui/CardContainer";
import { HealthStateModal } from "./components/HealthStateModal";
import dayjs from "dayjs";
import { Status } from "./components/Status/Status";
import { NotificationDetails } from "../Notifications/components/NotificationDetails/NotificationDetails";

export const RecommendationsPage = () => {
  const user = useSelector(getUserSelector);
  const [isNotificationsLoading, notifications, resetNotifications] =
    useGeneralDataHook(async () => {
      const newNotifications = await firebaseRepositories.notifications.getDocs(
        where("patient", "==", user.docId)
      );
      return newNotifications
        .filter((notification) => notification.recommendation)
        .sort(
          (a, b) =>
            -dayjs(a.recommendation.createdAt).diff(
              dayjs(b.recommendation.createdAt),
              "second"
            )
        );
    }, []);

  const [isDoctorLoading, doctors] = useGeneralDataHook(async () => {
    if (notifications && notifications.length) {
      return firebaseRepositories.users.getDocs(
        where(
          "docId",
          "in",
          notifications.map(({ doctor }) => doctor)
        )
      );
    }
    return null;
  }, [notifications]);

  const isLoading = useMemo(
    () => isNotificationsLoading || isDoctorLoading,
    [isNotificationsLoading, isDoctorLoading]
  );

  const [isOpen, setIsOpen] = useState(false);
  const [healthStates, setHealthStates] = useState([]);

  const onOpen = (notification) => {
    setHealthStates(notification.recommendation.healthStates);
    setIsOpen(true);
  };

  const onClose = () => {
    setHealthStates([]);
    setIsOpen(false);
  };

  const onStatusChange = async (notification, newStatus) => {
    const { patientReply } = notification.recommendation;
    const newPatientReply = {
      createdAt: dayjs().toDate().toString(),
      status: newStatus,
      comment: patientReply?.comment ?? "",
    };
    await firebaseRepositories.notifications.updateDoc({
      ...notification,
      recommendation: {
        ...notification.recommendation,
        patientReply: newPatientReply,
      },
    });
    await resetNotifications();
  };

  return (
    <PageContainer className="recommendations-page">
      {isLoading && <LoadingSpinner />}
      {!isLoading && !!notifications && !notifications.length && (
        <div className="no-recommendations">Нет рекомендаций</div>
      )}
      {!isLoading && !!notifications && !!notifications.length && !!doctors && (
        <CardContainer className="recommendations-container">
          <TableContainer component={Paper}>
            <Typography sx={{ textAlign: "center" }} variant="h6">
              Рекоммендации
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Дата</TableCell>
                  <TableCell>Доктор</TableCell>
                  <TableCell>Отклонения по показателям</TableCell>
                  <TableCell>Назначения</TableCell>
                  <TableCell>Комментарий</TableCell>
                  <TableCell>Статус</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notifications.map((notification) => {
                  const doctor = doctors.find(
                    ({ docId }) => docId === notification.doctor
                  );
                  return (
                    <TableRow
                      key={notification.docId}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell>
                        {formatDate(notification.recommendation.createdAt)}
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
                            src={doctor.imageUrl}
                            alt={getUserFullName(doctor)}
                          />
                          <Typography>{getUserFullName(doctor)}</Typography>
                        </div>
                      </TableCell>
                      <TableCell sx={{ minWidth: "300px" }}>
                        <CardContainer className="report-date">
                          Дата уведомления: {formatDate(notification.createdAt)}
                        </CardContainer>
                        <NotificationDetails notification={notification} />
                      </TableCell>
                      <TableCell>
                        <div className="recommendation-details">
                          {!!notification.recommendation.healthStates
                            .length && (
                            <div className="advices">
                              {notification.recommendation.healthStates.map(
                                (healthState) => (
                                  <CardContainer
                                    key={notification.docId + healthState.docId}
                                    className="advice"
                                  >
                                    {healthState.title}
                                  </CardContainer>
                                )
                              )}
                              <Button
                                variant="contained"
                                color="info"
                                sx={{ fontSize: "11px", fontWeight: "bold" }}
                                onClick={() => onOpen(notification)}
                              >
                                Подробнее
                              </Button>
                            </div>
                          )}
                          {!notification.recommendation.healthStates.length && (
                            <div>Назначений нет.</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {notification.recommendation.comment}
                      </TableCell>
                      <TableCell>
                        <Status
                          notification={notification}
                          onStatusChange={onStatusChange}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContainer>
      )}
      <HealthStateModal
        isOpen={isOpen}
        onClose={onClose}
        healthStates={healthStates}
      />
    </PageContainer>
  );
};
