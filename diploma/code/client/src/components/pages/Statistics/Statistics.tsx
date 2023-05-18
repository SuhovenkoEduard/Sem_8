import React, { useMemo, useState } from "react";
import { PageContainer } from "components/layout";
import { Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { getUserSelector } from "store/selectors";
import { CardContainer } from "components/ui/CardContainer";
import { chartsInfo } from "components/pages/Statistics/constants";
import { LineChart } from "components/pages/Statistics/charts/LineChart";
import dayjs from "dayjs";
import {
  convertDailyLogToDailyLogData,
  DailyLogData,
} from "firestore/converters";
import { useRelatives } from "components/pages/Statistics/useRelatives";
import { LoadingSpinner } from "components/ui/LoadingSpinner";
import { DesktopDatePicker, MobileDatePicker } from "@mui/x-date-pickers";
import { isMobile } from "react-device-detect";

import "./statistics.scss";

const getMinDate = (dailyLogsData: DailyLogData[]) =>
  new Date(
    Math.min(...dailyLogsData.map(({ createdAt }) => +new Date(createdAt)))
  ).toString();

const getMaxDate = (dailyLogsData: DailyLogData[]) =>
  new Date(
    Math.max(...dailyLogsData.map(({ createdAt }) => +new Date(createdAt)))
  ).toString();

const getDateWithDayOnly = (date: string | null) =>
  dayjs(dayjs(date ?? undefined).format("YYYY-MM-DD"));

const getDateWithDayOnlyDayjs = (date: dayjs.Dayjs | null) =>
  getDateWithDayOnly(date ? date.toDate().toString() : null);

export const Statistics = () => {
  const user = useSelector(getUserSelector);

  const { isLoading, patient } = useRelatives(user);

  const dailyLogsData = useMemo(() => {
    if (patient && patient.diary?.dailyLogs) {
      return patient.diary.dailyLogs
        .map(convertDailyLogToDailyLogData)
        .sort(
          (left, right) =>
            +new Date(left.createdAt) - +new Date(right.createdAt)
        );
    }
    return [];
  }, [patient]);

  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(dayjs());

  const filteredDailyLogsData: DailyLogData[] = useMemo(
    () =>
      dailyLogsData
        .filter(
          ({ createdAt }) =>
            getDateWithDayOnly(createdAt).diff(
              !startDate
                ? getDateWithDayOnly(getMinDate(dailyLogsData) ?? null)
                : getDateWithDayOnlyDayjs(startDate),
              "day"
            ) >= 0
        )
        .filter(
          ({ createdAt }) =>
            getDateWithDayOnlyDayjs(endDate).diff(
              getDateWithDayOnly(createdAt),
              "day"
            ) >= 0
        ),
    [dailyLogsData, startDate, endDate]
  );

  const DatePickerComponent = isMobile ? MobileDatePicker : DesktopDatePicker;

  return (
    <PageContainer className="statistics-page-container">
      <Typography variant="h4" className="statistics-page-title">
        Статистика
      </Typography>
      {isLoading || !patient ? (
        <LoadingSpinner />
      ) : (
        <div className="statistics-page-content">
          <div className="controls">
            <DatePickerComponent
              className={isMobile ? "mobile-date-picker" : ""}
              label="Дата начала периода"
              value={startDate}
              maxDate={endDate}
              onChange={(newValue) => setStartDate(newValue)}
            />
            <DatePickerComponent
              className={isMobile ? "mobile-date-picker" : ""}
              label="Дата конца периода"
              value={endDate}
              minDate={startDate}
              onChange={(newValue) => setEndDate(newValue)}
            />
          </div>
          <div className="charts">
            {chartsInfo.map((chartInfo, index) => (
              <CardContainer
                title={chartInfo.title}
                className="chart-card-container"
                key={index}
              >
                <LineChart
                  dailyLogsData={filteredDailyLogsData}
                  title={chartInfo.title}
                  propName={chartInfo.propName}
                />
              </CardContainer>
            ))}
          </div>
          <div style={{ height: "5rem" }} />
        </div>
      )}
    </PageContainer>
  );
};
