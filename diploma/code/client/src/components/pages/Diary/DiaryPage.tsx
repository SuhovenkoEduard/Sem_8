import React, { useEffect, useMemo, useState } from "react";
import { PageContainer } from "components/layout";
import { DateCalendar } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useDailyLog, useDailyLogData } from "components/pages/Diary/hooks/";
import { Button, TextField, Typography } from "@mui/material";
import { DailyLog, Diary, User } from "firestore/types/collections.types";
import { CardContainer } from "components/ui/CardContainer";
import { DailyLogDataView } from "components/pages/Diary/components";
import { LoadingSpinner } from "components/ui/LoadingSpinner";
import { deepCopy } from "deep-copy-ts";
import { DiaryFormErrors } from "components/pages/Diary/types";
import { deepEqual } from "ts-deep-equal";
import { dailyLogDataValidationObj } from "components/pages/Diary/helpers";
import {
  convertDailyLogDataToDailyLog,
  convertDailyLogToDailyLogData,
  DailyLogData,
} from "firestore/converters";
import { firebaseRepositories } from "firestore/data/repositories";
import { fetchUser } from "store/reducers/user/actions";
import { setDailyLog } from "store/reducers/user/userSlice";
import { NotificationManager } from "react-notifications";
import { GlobalState, useAppDispatch } from "store";
import { useSelector } from "react-redux";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { isMobile } from "react-device-detect";

import "./diary.scss";

export const emptyErrors: DiaryFormErrors = {
  sugarLevel: null,
  pulse: null,
  systolic: null,
  diastolic: null,
  total: null,
  weight: null,
  temperature: null,
};

export const DiaryPage = () => {
  // saving
  const user = useSelector<GlobalState, User>(
    (state) => state.currentUser.user as User
  );
  const dispatch = useAppDispatch();

  // diary
  const [currentDate, setCurrentDate] = useState<dayjs.Dayjs>(dayjs());

  const originalDailyLog = useDailyLog(currentDate);

  const { dailyLogData, setDailyLogData, resetDailyLogData } =
    useDailyLogData(originalDailyLog);

  const onDatePickerChange = (newValue: dayjs.Dayjs | null) => {
    if (newValue) {
      setCurrentDate(newValue);
    }
  };

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [errors, setErrors] = useState<DiaryFormErrors>(deepCopy(emptyErrors));
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  const isEditable = useMemo(
    () => currentDate.format("l") === dayjs().format("l"),
    [currentDate]
  );
  const [isFormSaving, setIsFormSaving] = useState<boolean>(false);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const newErrors = Object.fromEntries(
      Object.keys(dailyLogDataValidationObj).map((key) => [
        key,
        dailyLogDataValidationObj[key](
          dailyLogData[key as keyof DailyLogData].toString()
        ),
      ])
    ) as unknown as DiaryFormErrors;
    setErrors(newErrors);
    setIsSubmitDisabled(
      Object.values(newErrors).some((value) => !!value) ||
        deepEqual(dailyLogData, convertDailyLogToDailyLogData(originalDailyLog))
    );
  }, [dailyLogData, originalDailyLog, isEditMode]);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDailyLogData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditButtonClick = () => {
    setIsEditMode(true);
  };

  const handleCancelButtonClick = () => {
    resetDailyLogData();
    setIsEditMode(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const diary: Diary = user.diary as Diary;
    const dailyLogs: DailyLog[] = diary.dailyLogs;

    try {
      setIsFormSaving(true);

      const newDailyLog: DailyLog = {
        ...convertDailyLogDataToDailyLog(dailyLogData),
        createdAt: new Date().toString(),
      };

      const newDiary: Diary = {
        ...diary,
        dailyLogs: [
          ...dailyLogs.filter(
            (dailyLog) =>
              dayjs(dailyLog.createdAt).format("l") !== currentDate.format("l")
          ),
          newDailyLog,
        ],
      };

      const newUser = {
        ...user,
        diary: newDiary,
      };
      await firebaseRepositories.users.updateDoc(newUser);
      await dispatch(fetchUser(newUser.docId));
    } catch (err) {
      dispatch(setDailyLog(convertDailyLogToDailyLogData(originalDailyLog)));
      console.log(err);
      NotificationManager.error("Couldn't save dailyLog data", "[DIARY SAVE]");
    } finally {
      setIsFormSaving(false);
      setIsEditMode(false);
    }
  };

  return (
    <PageContainer className="diary-page-container">
      <Typography variant="h4" className="page-title">
        Дневник
      </Typography>
      <div className="diary-page-content">
        <CardContainer className="calendar-container">
          {isMobile ? (
            <MobileDatePicker
              disabled={isEditMode}
              value={currentDate}
              onChange={onDatePickerChange}
            />
          ) : (
            <DateCalendar
              disabled={isEditMode}
              value={currentDate}
              onChange={onDatePickerChange}
            />
          )}
        </CardContainer>
        {!isEditMode ? (
          <DailyLogDataView
            dailyLogData={dailyLogData}
            handleEditButtonClick={handleEditButtonClick}
            isEditable={isEditable}
          />
        ) : (
          <div className="edit-form-container">
            <form className="edit-form" onSubmit={handleSubmit}>
              <TextField
                label="Уровень сахара (ммоль/л)"
                name="sugarLevel"
                value={dailyLogData.sugarLevel}
                onChange={handleFieldChange}
                fullWidth
                margin="normal"
                error={!!errors.sugarLevel}
                helperText={errors.sugarLevel}
                disabled={isFormSaving}
              />
              <TextField
                label="Пульс (уд/мин)"
                name="pulse"
                value={dailyLogData.pulse}
                onChange={handleFieldChange}
                fullWidth
                margin="normal"
                error={!!errors.pulse}
                helperText={errors.pulse}
                disabled={isFormSaving}
              />
              <TextField
                label="Систолическое давление (ммрт)"
                name="systolic"
                value={dailyLogData.systolic}
                onChange={handleFieldChange}
                fullWidth
                margin="normal"
                error={!!errors.systolic}
                helperText={errors.systolic}
                disabled={isFormSaving}
              />
              <TextField
                label="Диастолическое давление (ммрт)"
                name="diastolic"
                value={dailyLogData.diastolic}
                onChange={handleFieldChange}
                fullWidth
                margin="normal"
                error={!!errors.diastolic}
                helperText={errors.diastolic}
                disabled={isFormSaving}
              />
              <TextField
                label="Количество каллорий (ккал)"
                name="total"
                value={dailyLogData.total}
                onChange={handleFieldChange}
                fullWidth
                margin="normal"
                error={!!errors.total}
                helperText={errors.total}
                disabled={isFormSaving}
              />
              <TextField
                label="Вес (кг)"
                name="weight"
                value={dailyLogData.weight}
                onChange={handleFieldChange}
                fullWidth
                margin="normal"
                error={!!errors.weight}
                helperText={errors.weight}
                disabled={isFormSaving}
              />
              <TextField
                label="Температура (°C)"
                name="temperature"
                value={dailyLogData.temperature}
                onChange={handleFieldChange}
                fullWidth
                margin="normal"
                error={!!errors.temperature}
                helperText={errors.temperature}
                disabled={isFormSaving}
              />
              {isFormSaving ? (
                <LoadingSpinner style={{ marginTop: "20px" }} />
              ) : (
                <div className="form-controls-container">
                  <Button
                    className="cancel-button"
                    variant="contained"
                    onClick={handleCancelButtonClick}
                  >
                    Отмена
                  </Button>
                  <Button
                    className="save-button"
                    type="submit"
                    variant="contained"
                    disabled={isSubmitDisabled}
                  >
                    Сохранить
                  </Button>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
