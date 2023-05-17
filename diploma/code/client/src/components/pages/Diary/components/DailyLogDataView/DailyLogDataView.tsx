import React from "react";
import dayjs from "dayjs";
import { EditButton } from "components/ui/EditButton";
import { CardContainer } from "components/ui/CardContainer";
import { DailyLogData } from "firestore/converters";

import "./dailylog-data-view.scss";

export const DailyLogDataView = ({
  dailyLogData,
  handleEditButtonClick,
  isEditable,
}: {
  dailyLogData: DailyLogData;
  handleEditButtonClick: () => void;
  isEditable: boolean;
}) => {
  const getDisplayValue = (propName: keyof DailyLogData): string | number =>
    (+dailyLogData[propName] || "-") as string | number;

  return (
    <CardContainer className="diary-page-content__info-container">
      <div className="diary-page-content__info-container__title">
        <h2>{`${dayjs(dailyLogData.createdAt).format(
          "HH:mm, DD MMMM YYYY"
        )}`}</h2>
        {isEditable && <EditButton onClick={handleEditButtonClick} />}
      </div>
      <p>Уровень сахара: {getDisplayValue("sugarLevel")} ммоль/л</p>
      <p>Пульс: {getDisplayValue("pulse")} уд/мин</p>
      <p>
        Давление: {getDisplayValue("systolic")}/{getDisplayValue("diastolic")}{" "}
        ммрт/ммрт
      </p>
      <p>Калории: {getDisplayValue("total")} ккал</p>
      <p>Вес: {getDisplayValue("weight")} кг</p>
      <p>Температура: {getDisplayValue("temperature")} °C</p>
    </CardContainer>
  );
};
