import React, { useState } from "react";
import { ThematicMaterial, User } from "firestore/types/collections.types";
import useAsyncEffect from "use-async-effect";
import { firebaseRepositories } from "firestore/data/repositories";
import { NotificationManager } from "react-notifications";
import { PageContainer } from "components/layout";
import { LoadingSpinner } from "components/ui/LoadingSpinner";
import { useNavigate, useParams } from "react-router-dom";
import { CardContainer } from "components/ui/CardContainer";
import Avatar from "@mui/material/Avatar";
import { getUserFullName } from "firestore/helpers";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Route } from "components/routing";
import ReactHtmlParser from "react-html-parser";
import { formatDate } from "helpers/helpers";

import "./thematic-material.scss";

export const ThematicMaterialPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [thematicMaterial, setThematicMaterial] =
    useState<ThematicMaterial | null>(null);
  const [author, setAuthor] = useState<User | null>(null);

  const params = useParams();
  const thematicMaterialId = params.id as string;

  useAsyncEffect(async () => {
    try {
      setIsLoading(true);
      const newMaterial =
        await firebaseRepositories.thematicMaterials.getDocById(
          thematicMaterialId
        );
      if (!newMaterial) {
        throw new Error("Материал не найден");
      }
      const newAuthor = await firebaseRepositories.users.getDocById(
        newMaterial.author
      );
      if (!newAuthor) {
        throw new Error("Автор материала не найден");
      }
      setThematicMaterial(newMaterial);
      setAuthor(newAuthor);
    } catch (e) {
      console.log(e);
      NotificationManager.error(
        "Загрузка тематического материала",
        "Ошибка Firestore"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <PageContainer className="thematic-material-page">
      {isLoading || !thematicMaterial || !author ? (
        <LoadingSpinner />
      ) : (
        <div className="thematic-material-container">
          <Button
            onClick={() => navigate(Route.thematicMaterials)}
            variant="contained"
            startIcon={<ArrowBackIcon />}
            sx={{ width: "min-content" }}
          >
            Вернуться
          </Button>
          <CardContainer className="thematic-material-header-container">
            <div className="image">
              <img
                src={thematicMaterial.imageUrl}
                alt={thematicMaterial.title}
              />
            </div>
            <div className="short-info">
              <div className="author">
                <div className="author-badge">
                  <div className="author-badge__avatar">
                    <Avatar src={author.imageUrl} />
                  </div>
                  <div className="author-badge__fullname">
                    {getUserFullName(author)}
                  </div>
                </div>
                <div className="light-text">Автор</div>
              </div>
              <div className="title">{thematicMaterial.title}</div>
              <div className="light-text">
                {formatDate(thematicMaterial.createdAt)}
              </div>
              <div className="description">{thematicMaterial.description}</div>
            </div>
          </CardContainer>
          <CardContainer className="thematic-material-body">
            {ReactHtmlParser(thematicMaterial.content)}
          </CardContainer>
          {/* todo comments for thematic material page */}
          {/*<CardContainer className="comments" title="Комментарии">*/}
          {/*{thematicMaterial.comments.map((comment) => (*/}
          {/*  <div key={comment.message.createdAt}>{JSON.stringify(comment, null, '  ')}</div>*/}
          {/*))}*/}
          {/*</CardContainer>*/}
        </div>
      )}
    </PageContainer>
  );
};
