import React, { useCallback, useMemo, useState } from "react";
import { PageContainer } from "components/layout";
import { useSelector } from "react-redux";
import { getUserSelector } from "store/selectors";
import { useRelatives } from "components/pages/Relative/hooks/useRelatives";
import { LoadingSpinner } from "components/ui/LoadingSpinner";
import { CardContainer } from "components/ui/CardContainer";
import { Role, User, UserInfo } from "firestore/types/collections.types";
import {
  convertRoleToRussian,
  convertUserToUserInfo,
} from "firestore/converters";
import { getUserFullName } from "firestore/helpers";
import { Button } from "@mui/material";
import { NotificationManager } from "react-notifications";
import { firebaseRepositories } from "firestore/data/repositories";
import { isMobile } from "react-device-detect";

import "./relative.scss";

export const RelativePage = () => {
  const currentUser = useSelector(getUserSelector);
  const [isRemoveLoading, setIsRemoveLoading] = useState<boolean>(false);
  const { isLoading, patient, relative, updateRelatives } =
    useRelatives(currentUser);

  const userInfo: UserInfo | null = useMemo(() => {
    const user: User | null =
      currentUser.role === Role.PATIENT ? relative : patient;
    if (!user) {
      return null;
    }
    return convertUserToUserInfo(user);
  }, [currentUser, relative, patient]);

  const removeRelative = async () => {
    if (!relative) {
      return;
    }
    try {
      setIsRemoveLoading(true);
      await firebaseRepositories.users.deleteDocById(relative.docId);
      await updateRelatives();
    } catch (e) {
      console.log(e);
      NotificationManager.error(
        "Удаление родственника",
        'Страница "родственник"'
      );
    } finally {
      setIsRemoveLoading(false);
    }
  };

  const handlePatientIdCopy = useCallback(async () => {
    const type = "text/plain";
    const blob = new Blob([currentUser.docId], { type });
    const data = [new ClipboardItem({ [type]: blob })];
    await navigator.clipboard.write(data);
  }, [currentUser]);

  return (
    <PageContainer className="relative-page">
      {isLoading ? (
        <LoadingSpinner />
      ) : !userInfo ? (
        <CardContainer className="no-relative-container">
          <div className="title">
            <h2>Родственник не приглашён</h2>
          </div>
          <img src="/images/missing-relative.png" alt="relative not found" />
          <div
            className="code"
            style={{ justifyContent: isMobile ? "center" : "space-between" }}
          >
            <div className="code-title">Код приглашения</div>
            <div className="code-content">
              <button onClick={handlePatientIdCopy}>{currentUser.docId}</button>
              <div className="description">
                Код выше нужно скопировать (клик по тексту) и передать
                родственнику для регистрации
              </div>
            </div>
          </div>
        </CardContainer>
      ) : (
        <div className="relative-page-content">
          <CardContainer className="avatar">
            <img
              className="avatar"
              src={userInfo.imageUrl}
              alt={getUserFullName(userInfo)}
            />
          </CardContainer>
          <CardContainer
            className="relative-page-info"
            title={
              currentUser.role === Role.PATIENT
                ? "Родственник"
                : "Родственник (пациент)"
            }
          >
            <div className="title">
              <h2>{getUserFullName(userInfo)}</h2>
            </div>
            <div>Эл. почта: {userInfo.email}</div>
            <div>Телефон: {userInfo.phone}</div>
            <div>Адрес: {userInfo.address}</div>
            <div>Тип учётной записи: {convertRoleToRussian(userInfo.role)}</div>
            <div className="role-logo-container">
              <img
                src={`/images/logos/${userInfo.role}-logo.png`}
                alt="Role logo"
              />
            </div>
            {currentUser.role === Role.PATIENT &&
              (isRemoveLoading ? (
                <LoadingSpinner
                  style={{ margin: "10px auto", width: "250px" }}
                />
              ) : (
                <Button
                  variant="outlined"
                  sx={{
                    color: "red",
                    borderColor: "red",
                    width: "250px",
                    margin: "10px auto",
                    fontSize: "11pt",
                  }}
                  onClick={removeRelative}
                >
                  Удалить родственника
                </Button>
              ))}
          </CardContainer>
        </div>
      )}
    </PageContainer>
  );
};
