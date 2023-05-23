import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Note } from "firestore/types/collections.types";
import { LoadingSpinner } from "components/ui/LoadingSpinner";
import { deepCopy } from "deep-copy-ts";
import { formatDate } from "helpers/helpers";
import { isMobile } from "react-device-detect";
import dayjs from "dayjs";

import "./note-modal.scss";

export const NoteModal = ({
  isOpen,
  onClose,
  submitNote,
  selectedNote,
}: {
  isOpen: boolean;
  onClose: () => void;
  submitNote: (note: Note) => Promise<void>;
  selectedNote: Note | null;
}) => {
  const getNote = useCallback(
    () =>
      selectedNote
        ? deepCopy(selectedNote)
        : {
            createdAt: dayjs().toDate().toString(),
            content: "",
          },
    [selectedNote]
  );

  const [note, setNote] = useState<Note>(getNote());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const resetNote = useCallback(() => {
    setNote(getNote());
  }, [setNote, getNote]);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNote((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitNote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    await submitNote({
      ...note,
      createdAt: dayjs().toDate().toString(),
    });
    setIsLoading(false);
    onClose();
  };

  useEffect(() => {
    resetNote();
  }, [selectedNote, isOpen, resetNote]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        {(selectedNote ? "Редактирование" : "Добавление") + " заметки"}
      </DialogTitle>
      <DialogContent
        className="modal-content"
        sx={{
          width: isMobile ? "300px" : "600px",
        }}
      >
        <form className="note-form" onSubmit={handleSubmitNote}>
          <TextField
            label="Дата"
            name="createdAt"
            value={formatDate(note.createdAt)}
            disabled={true}
          />
          <TextField
            multiline
            minRows={3}
            maxRows={3}
            label="Текст"
            name="content"
            value={note.content}
            onChange={handleFieldChange}
            disabled={isLoading}
          />
          <DialogActions className="controls">
            <Button onClick={onClose} disabled={isLoading} variant="outlined">
              Отмена
            </Button>
            {isLoading ? (
              <LoadingSpinner style={{ margin: "0", width: "100px" }} />
            ) : (
              <Button
                type="submit"
                variant="outlined"
                disabled={selectedNote?.content === note.content}
                autoFocus
              >
                {selectedNote ? "Изменить" : "Добавить"}
              </Button>
            )}
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
