import React, { useCallback, useEffect, useMemo, useState } from "react";
import { PageContainer } from "components/layout";
import { Role, ThematicMaterial } from "firestore/types/collections.types";
import { firebaseRepositories } from "firestore/data/repositories";
import { NotificationManager } from "react-notifications";
import { LoadingSpinner } from "components/ui/LoadingSpinner";
import { ThematicMaterialView } from "components/pages/ThematicMaterials/components/ThematicMaterialView";
import { useNavigate } from "react-router-dom";
import { Route } from "components/routing";
import { isMobile } from "react-device-detect";
import { useGeneralModalHandlers } from "../../../hooks/useGeneralModalHandlers";
import { Button } from "@mui/material";
import { ThematicMaterialEditModal } from "./components";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { getUserSelector } from "../../../store/selectors";

import "./thematic-materials.scss";

export const ThematicMaterialsPage = () => {
  const user = useSelector(getUserSelector);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [thematicMaterials, setThematicMaterials] = useState<
    ThematicMaterial[]
  >([]);

  const loadThematicMaterials = useCallback(async () => {
    try {
      setIsLoading(true);
      const newMaterials =
        await firebaseRepositories.thematicMaterials.getDocs();
      setThematicMaterials(newMaterials);
    } catch (e) {
      console.log(e);
      NotificationManager.error(
        "Загрузка тематических материалов",
        "Ошибка Firestore"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadThematicMaterials();
  }, [loadThematicMaterials]);

  const [
    isThematicMaterialModalOpened,
    openThematicMaterialModal,
    closeThematicMaterialModal,
  ] = useGeneralModalHandlers();

  const submitThematicMaterial = async (thematicMaterial: ThematicMaterial) => {
    try {
      setIsLoading(true);
      await firebaseRepositories.thematicMaterials.updateDoc(thematicMaterial);
      await loadThematicMaterials();
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const sortedThematicMaterials = useMemo(() => {
    return thematicMaterials.sort((left, right) =>
      dayjs(left.createdAt).diff(dayjs(right.createdAt))
    );
  }, [thematicMaterials]);

  return (
    <PageContainer
      className="thematic-materials-page"
      style={{
        padding: isMobile ? "20px 10px" : "20px",
      }}
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {[Role.DOCTOR, Role.CONTENT_MAKER].includes(user.role) && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                color="success"
                variant="contained"
                sx={{ fontSize: "11px", fontWeight: "bold" }}
                onClick={openThematicMaterialModal as () => void}
              >
                Добавить тематический материал
              </Button>
            </div>
          )}
          <div
            className="thematic-materials-container"
            style={{
              gap: isMobile ? "10px" : "20px",
              width: isMobile ? "350px" : "1080px",
            }}
          >
            {sortedThematicMaterials.map((thematicMaterial) => (
              <ThematicMaterialView
                key={thematicMaterial.docId}
                {...thematicMaterial}
                onClick={() =>
                  navigate(
                    `${Route.thematicMaterials}/${thematicMaterial.docId}`
                  )
                }
              />
            ))}
          </div>
          <ThematicMaterialEditModal
            isOpen={isThematicMaterialModalOpened}
            onClose={closeThematicMaterialModal as () => void}
            submitThematicMaterial={submitThematicMaterial}
            selectedThematicMaterial={null}
          />
        </div>
      )}
    </PageContainer>
  );
};
