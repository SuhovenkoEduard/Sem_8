import React, { SyntheticEvent, useEffect, useMemo, useState } from "react";
import { PageContainer } from "components/layout";
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
import { usePatientsStatistics } from "components/pages/Statistics/usePatientsStatistics";
import { LoadingSpinner } from "components/ui/LoadingSpinner";
import { User, Role } from "firestore/types/collections.types";
import { DesktopDatePicker, MobileDatePicker } from "@mui/x-date-pickers";
import { isMobile } from "react-device-detect";
import { getUserFullName } from "firestore/helpers";
import { Autocomplete, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";

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

export const StatisticsPage = () => {
  const user = useSelector(getUserSelector);

  const { isLoading, patients } = usePatientsStatistics(user);

  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);

  useEffect(() => {
    if (!patients.length) {
      return;
    }
    if ([Role.PATIENT, Role.RELATIVE, Role.DOCTOR].includes(user.role)) {
      setSelectedPatient(patients[0]);
    }
  }, [user, patients, setSelectedPatient]);

  const dailyLogsData = useMemo(() => {
    if (selectedPatient && selectedPatient.diary?.dailyLogs) {
      return selectedPatient.diary.dailyLogs
        .map(convertDailyLogToDailyLogData)
        .sort(
          (left, right) =>
            +new Date(left.createdAt) - +new Date(right.createdAt)
        );
    }
    return [];
  }, [selectedPatient]);

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

  const getUserOption = (patient: User) => ({
    value: patient.docId,
    label: getUserFullName(patient),
    imageUrl: patient.imageUrl,
  });

  const handleSelectedUserChange = (event: SyntheticEvent, option: unknown) => {
    if (!patients.length) {
      return;
    }
    setStartDate(null);
    setEndDate(dayjs());
    const castedOption = option as { value: string; label: string } | null;
    setSelectedPatient(
      patients.find((patient) => patient.docId === castedOption?.value) ?? null
    );
  };

  return (
    <PageContainer className="statistics-page-container">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {!patients.length && (
            <div className="no-patients" style={{ fontSize: "18pt" }}>
              {user.role === Role.DOCTOR && "Нет пациентов"}
            </div>
          )}
          {patients.length > 0 && (
            <div className="statistics-page-content">
              {user.role === Role.RELATIVE && selectedPatient && (
                <Typography component="h1" variant="h5">
                  {getUserFullName(selectedPatient)}
                </Typography>
              )}
              {user.role === Role.DOCTOR && (
                <Autocomplete
                  id="patients-select"
                  className="select"
                  value={
                    selectedPatient ? getUserOption(selectedPatient) : null
                  }
                  onChange={handleSelectedUserChange}
                  options={patients.map(getUserOption)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Выберите пациента"
                      inputProps={{
                        ...params.inputProps,
                      }}
                    />
                  )}
                  blurOnSelect
                  noOptionsText="Нет пациентов с таким именем."
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                      {...props}
                    >
                      <Avatar
                        src={option.imageUrl}
                        sx={{
                          width: "30px",
                          height: "30px",
                          marginRight: "20px",
                        }}
                      />
                      {option.label}
                    </Box>
                  )}
                />
              )}
              {selectedPatient && (
                <>
                  <div className="diabet-type">
                    Тип диабета: {selectedPatient.diary?.diabetType}
                  </div>
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
                </>
              )}
              <div style={{ height: "5rem" }} />
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
};
