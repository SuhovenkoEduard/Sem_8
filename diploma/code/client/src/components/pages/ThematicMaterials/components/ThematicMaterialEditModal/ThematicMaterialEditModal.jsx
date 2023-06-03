import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { LoadingSpinner } from "components/ui/LoadingSpinner";
import { deepCopy } from "deep-copy-ts";
import { formatDate } from "helpers/helpers";
import { isMobile } from "react-device-detect";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { getUserInfoSelector } from "../../../../../store/selectors";

import "./thematic-material-modal.scss";
import {
  generateDocId,
  getUserFullName,
} from "../../../../../firestore/helpers";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

export const ThematicMaterialEditModal = ({
  isOpen,
  onClose,
  submitThematicMaterial,
  selectedThematicMaterial,
}) => {
  const user = useSelector(getUserInfoSelector);

  const getThematicMaterial = useCallback(
    () =>
      selectedThematicMaterial
        ? deepCopy(selectedThematicMaterial)
        : {
            createdAt: dayjs().toDate().toString(),
            docId: generateDocId(),
            imageUrl: "",
            title: "",
            description: "",
            content: "",
            author: user.docId,
            comments: [],
          },
    [selectedThematicMaterial, user.docId]
  );

  const [thematicMaterial, setThematicMaterial] = useState(
    getThematicMaterial()
  );
  const [isLoading, setIsLoading] = useState(false);

  const resetThematicMaterial = useCallback(() => {
    setThematicMaterial(getThematicMaterial());
  }, [setThematicMaterial, getThematicMaterial]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setThematicMaterial((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitThematicMaterial = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    await submitThematicMaterial({
      ...thematicMaterial,
      createdAt: dayjs().toDate().toString(),
    });
    setIsLoading(false);
    onClose();
  };

  useEffect(() => {
    resetThematicMaterial();
  }, [selectedThematicMaterial, isOpen, resetThematicMaterial]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        {(selectedThematicMaterial ? "Редактирование" : "Добавление") +
          " тематического материала"}
      </DialogTitle>
      <DialogContent
        className="modal-content"
        sx={{
          width: isMobile ? "300px" : "600px",
        }}
      >
        <form
          className="thematic-material-form"
          onSubmit={handleSubmitThematicMaterial}
        >
          <TextField
            label="Дата"
            name="createdAt"
            value={formatDate(thematicMaterial.createdAt)}
            disabled={true}
          />
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            Автор:
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <Avatar src={user.imageUrl} alt={getUserFullName(user)} />
              <Typography>{getUserFullName(user)}</Typography>
            </div>
          </div>
          <TextField
            label="Ссылка на изображение"
            name="imageUrl"
            value={thematicMaterial.imageUrl}
            onChange={handleFieldChange}
          />
          <TextField
            label="Название"
            name="title"
            value={thematicMaterial.title}
            onChange={handleFieldChange}
          />
          <TextField
            label="Описание"
            name="description"
            value={thematicMaterial.description}
            onChange={handleFieldChange}
          />
          <TextField
            multiline
            minRows={3}
            maxRows={5}
            label="Содержание"
            name="content"
            value={thematicMaterial.content}
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
                disabled={
                  selectedThematicMaterial?.imageUrl ===
                    thematicMaterial.imageUrl &&
                  selectedThematicMaterial?.title === thematicMaterial.title &&
                  selectedThematicMaterial?.description ===
                    thematicMaterial.description &&
                  selectedThematicMaterial?.content === thematicMaterial.content
                }
                autoFocus
              >
                {selectedThematicMaterial ? "Изменить" : "Добавить"}
              </Button>
            )}
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
