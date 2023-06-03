import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { CardContainer } from "../../../ui/CardContainer";
import { isMobile } from "react-device-detect";
import { EditButton } from "../../../ui/EditButton";
import { Button, TextField } from "@mui/material";

export const DoctorDescription = ({ doctor, changeDescription }) => {
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setDescription(doctor.employee.description);
  }, [doctor.employee.description]);

  const onSave = () => {
    changeDescription(description);
    setIsEditing(false);
  };

  const onCancel = () => {
    setDescription(doctor.employee.description);
    setIsEditing(false);
  };

  return (
    <CardContainer
      sx={{ width: isMobile ? undefined : "900px", padding: "20px" }}
    >
      <Typography sx={{ textAlign: "center" }} variant="h6">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div>Описание</div>
          {!isEditing && <EditButton onClick={() => setIsEditing(true)} />}
        </div>
      </Typography>
      {!isEditing ? (
        <Typography>{doctor.employee.description}</Typography>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <TextField
            multiline
            minRows={3}
            maxRows={5}
            label="Описание"
            value={description}
            onChange={({ target: { value } }) => setDescription(value)}
            fullWidth
          />
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <Button color="primary" variant="outlined" onClick={onCancel}>
              Отмена
            </Button>
            <Button
              color="primary"
              variant="outlined"
              onClick={onSave}
              disabled={doctor.employee.description === description}
            >
              Сохранить
            </Button>
          </div>
        </div>
      )}
    </CardContainer>
  );
};
