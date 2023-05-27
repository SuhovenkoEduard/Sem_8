import React, { useEffect, useState } from "react";
import { PageContainer } from "components/layout";
import { DateCalendar } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useDailyLog, useDailyLogData } from "components/pages/Diary/hooks/";
import { Button, TextField } from "@mui/material";
import { DailyLog, Diary, Note, User } from "firestore/types/collections.types";
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
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { NoteModal } from "components/pages/Diary/components/NoteModal";
import { EditButton } from "components/ui/EditButton";
import { formatDate } from "helpers/helpers";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

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
        createdAt: currentDate.toDate().toString(),
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
      NotificationManager.error(
        "Сохранение дневника",
        '[Ошибка на странице "дневник"]'
      );
    } finally {
      setIsFormSaving(false);
      setIsEditMode(false);
    }
  };

  // notes
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [deletedNote, setDeletedNote] = useState<Note | null>(null);

  const handleSubmitNote = async (note: Note) => {
    const diary: Diary = user.diary as Diary;
    const dailyLogs: DailyLog[] = diary.dailyLogs;
    try {
      const notesWithoutSelected = dailyLogData.notes.filter(
        (_note) => _note.createdAt !== selectedNote?.createdAt
      );
      const newNotes = [...notesWithoutSelected, note];
      const newDailyLog: DailyLog = {
        ...originalDailyLog,
        notes: newNotes,
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
    } catch (e) {
      dispatch(setDailyLog(convertDailyLogToDailyLogData(originalDailyLog)));
      console.log(e);
      NotificationManager.error(
        "Сохранение заметки",
        '[Ошибка на странице "дневник"]'
      );
    }
  };

  const handleDeleteNote = async (note: Note) => {
    const diary: Diary = user.diary as Diary;
    const dailyLogs: DailyLog[] = diary.dailyLogs;
    try {
      setDeletedNote(note);
      const newNotes = dailyLogData.notes.filter(
        (_note) => _note.createdAt !== note.createdAt
      );
      const newDailyLog: DailyLog = {
        ...originalDailyLog,
        notes: newNotes,
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
    } catch (e) {
      dispatch(setDailyLog(convertDailyLogToDailyLogData(originalDailyLog)));
      console.log(e);
      NotificationManager.error(
        "Сохранение заметки",
        '[Ошибка на странице "дневник"]'
      );
    } finally {
      setDeletedNote(null);
    }
  };

  const onOpen = () => {
    setIsOpen(true);
  };

  const handleOpenNoteModal = (note: Note) => {
    setSelectedNote(note);
    setIsOpen(true);
  };

  const handleCloseNoteModal = () => {
    setIsOpen(false);
    setTimeout(() => setSelectedNote(null), 300);
  };

  return (
    <PageContainer className="diary-page-container">
      <div className="diary-page-content">
        <CardContainer className="calendar-container">
          <DateCalendar
            disabled={isEditMode}
            value={currentDate}
            onChange={onDatePickerChange}
          />
        </CardContainer>
        {!isEditMode ? (
          <DailyLogDataView
            dailyLogData={dailyLogData}
            handleEditButtonClick={handleEditButtonClick}
            isEditable
          />
        ) : (
          <div className="edit-form-container">
            <form className="edit-form" onSubmit={handleSubmit}>
              <TextField
                label="Уровень сахара (ммоль/л)"
                name="sugarLevel"
                value={dailyLogData.sugarLevel === "0" ? "" : dailyLogData.sugarLevel}
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
                value={dailyLogData.pulse === "0" ? "" : dailyLogData.pulse}
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
                value={dailyLogData.systolic === "0" ? "" : dailyLogData.systolic}
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
                value={dailyLogData.diastolic === "0" ? "" : dailyLogData.diastolic}
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
                value={dailyLogData.total === "0" ? "" : dailyLogData.total}
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
                value={dailyLogData.weight === "0" ? "" : dailyLogData.weight}
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
                value={dailyLogData.temperature === "0" ? "" : dailyLogData.temperature}
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
        <CardContainer className="notes" title="Заметки">
          <div className="notes-content">
            {!dailyLogData.notes.length ? (
              <div className="notes-empty">Заметок нет</div>
            ) : (
              [...dailyLogData.notes]
                .sort((left, right) =>
                  dayjs(left.createdAt).diff(dayjs(right.createdAt), "hour")
                )
                .map((note) => (
                  <CardContainer className="note" key={note.createdAt}>
                    {deepEqual(note, deletedNote ?? {}) ? (
                      <LoadingSpinner />
                    ) : (
                      <>
                        <div className="first-line">
                          <div className="date">
                            {formatDate(note.createdAt)}
                          </div>
                          <div className="controls">
                            <EditButton
                              onClick={() => handleOpenNoteModal(note)}
                            />
                            <IconButton
                              className="delete-button"
                              onClick={() => handleDeleteNote(note)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </div>
                        </div>
                        <div className="content">{note.content}</div>
                      </>
                    )}
                  </CardContainer>
                ))
            )}
            <div className="page-controls">
              <Button
                className="add-note-button"
                onClick={onOpen}
                variant="outlined"
                startIcon={<AddCircleIcon />}
              >
                Добавить заметку
              </Button>
            </div>
          </div>
          <NoteModal
            isOpen={isOpen}
            onClose={handleCloseNoteModal}
            submitNote={handleSubmitNote}
            selectedNote={selectedNote}
          />
        </CardContainer>
      </div>
    </PageContainer>
  );
};
