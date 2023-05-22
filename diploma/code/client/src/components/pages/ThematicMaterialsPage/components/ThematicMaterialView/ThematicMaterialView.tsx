import React from "react";
import { ThematicMaterial } from "firestore/types/collections.types";
import { CardContainer } from "components/ui/CardContainer";
import { isMobile } from "react-device-detect";

import "./thematic-material-view.scss";

export const ThematicMaterialView = ({
  imageUrl,
  title,
  description,
  onClick,
}: ThematicMaterial & {
  onClick: () => void;
}) => {
  return (
    <CardContainer
      className="thematic-material-view"
      onClick={onClick}
      sx={{ width: isMobile ? "170px" : "200px" }}
    >
      <CardContainer className="image-container">
        <img src={imageUrl} alt={title} />
      </CardContainer>
      <div className="title">{title}</div>
      <div className="description">{description}</div>
    </CardContainer>
  );
};
