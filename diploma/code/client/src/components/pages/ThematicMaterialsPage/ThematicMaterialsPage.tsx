import React, { useState } from "react";
import { PageContainer } from "components/layout";
import { ThematicMaterial } from "firestore/types/collections.types";
import useAsyncEffect from "use-async-effect";
import { firebaseRepositories } from "firestore/data/repositories";
import { NotificationManager } from "react-notifications";
import { LoadingSpinner } from "components/ui/LoadingSpinner";
import { ThematicMaterialView } from "components/pages/ThematicMaterialsPage/components/ThematicMaterialView";
import { useNavigate } from "react-router-dom";
import { Route } from "components/routing";
import { isMobile } from "react-device-detect";

import "./thematic-materials.scss";

export const ThematicMaterialsPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [thematicMaterials, setThematicMaterials] = useState<
    ThematicMaterial[]
  >([]);

  useAsyncEffect(async () => {
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
        <div
          className="thematic-materials-container"
          style={{
            gap: isMobile ? "10px" : "20px",
            width: isMobile ? "410px" : "1080px",
          }}
        >
          {thematicMaterials.map((thematicMaterial) => (
            <ThematicMaterialView
              key={thematicMaterial.docId}
              {...thematicMaterial}
              onClick={() =>
                navigate(`${Route.thematicMaterials}/${thematicMaterial.docId}`)
              }
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
};
