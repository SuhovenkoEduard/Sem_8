import React from "react";
import { IconButton } from "@mui/material";
import { ReactComponent as EditIcon } from "assets/icons/edit-icon.svg";

import "./edit-button.scss";

export const EditButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <IconButton className="edit-button-container" onClick={onClick}>
      <EditIcon className="edit-button-icon" />
    </IconButton>
  );
};
