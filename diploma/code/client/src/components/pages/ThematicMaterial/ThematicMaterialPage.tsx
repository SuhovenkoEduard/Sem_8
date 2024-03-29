import React, { useCallback, useEffect, useState } from "react";
import {
  Role,
  ThematicMaterial,
  User,
} from "firestore/types/collections.types";
import { firebaseRepositories } from "firestore/data/repositories";
import { NotificationManager } from "react-notifications";
import { PageContainer } from "components/layout";
import { LoadingSpinner } from "components/ui/LoadingSpinner";
import { useNavigate, useParams } from "react-router-dom";
import { CardContainer } from "components/ui/CardContainer";
import Avatar from "@mui/material/Avatar";
import { getUserFullName } from "firestore/helpers";
import { Button, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Route } from "components/routing";
import ReactHtmlParser from "react-html-parser";
import { formatDate } from "helpers/helpers";
import { EditButton } from "components/ui/EditButton";
import { useSelector } from "react-redux";
import { getUserInfoSelector } from "store/selectors";
import pretty from "pretty";
import { deepCopy } from "deep-copy-ts";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import "./thematic-material.scss";
import { useGeneralModalHandlers } from "../../../hooks/useGeneralModalHandlers";
import { ThematicMaterialEditModal } from "../ThematicMaterials";
import Typography from "@mui/material/Typography";

const formatContent = (content: string) => pretty(content, { ocd: true });

export const ThematicMaterialPage = () => {
  const navigate = useNavigate();
  const userInfo = useSelector(getUserInfoSelector);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [thematicMaterial, setThematicMaterial] =
    useState<ThematicMaterial | null>(null);
  const [author, setAuthor] = useState<User | null>(null);

  const params = useParams();
  const thematicMaterialId = params.id as string;

  const loadThematicMaterial = useCallback(async () => {
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
  }, [thematicMaterialId]);

  useEffect(() => {
    loadThematicMaterial();
  }, [loadThematicMaterial]);

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [newContent, setNewContent] = useState<string>("");
  const [isFormSaving, setIsFormSaving] = useState<boolean>(false);

  const handleThematicMaterialEdit = () => {
    setNewContent(formatContent(thematicMaterial?.content as string));
    setIsEditMode((prev) => !prev);
  };

  const handleCancel = () => {
    setNewContent("");
    setIsEditMode(false);
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewContent(value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setIsFormSaving(true);
      const newThematicMaterial: ThematicMaterial = {
        ...deepCopy(thematicMaterial),
        content: newContent,
      } as ThematicMaterial;
      await firebaseRepositories.thematicMaterials.updateDoc(
        newThematicMaterial
      );
      const updatedMaterial =
        await firebaseRepositories.thematicMaterials.getDocById(
          thematicMaterialId
        );
      if (!updatedMaterial) {
        throw new Error("Материал не найден");
      }
      const newAuthor = await firebaseRepositories.users.getDocById(
        updatedMaterial.author
      );
      if (!newAuthor) {
        throw new Error("Автор материала не найден");
      }
      setThematicMaterial(updatedMaterial);
      setAuthor(newAuthor);
    } catch (e) {
      console.log(e);
      NotificationManager.error("Сохранение статьи", "Страница статьи");
    } finally {
      setNewContent("");
      setIsEditMode(false);
      setIsFormSaving(false);
    }
  };

  const [
    isThematicMaterialModalOpened,
    openThematicMaterialModal,
    closeThematicMaterialModal,
  ] = useGeneralModalHandlers();

  const submitThematicMaterial = async (
    updatedThematicMaterial: ThematicMaterial
  ) => {
    try {
      setIsLoading(true);
      await firebaseRepositories.thematicMaterials.updateDoc(
        updatedThematicMaterial
      );
      await loadThematicMaterial();
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteThematicMaterial = async () => {
    if (!thematicMaterial?.docId) {
      return;
    }
    try {
      setIsLoading(true);
      await firebaseRepositories.thematicMaterials.deleteDocById(
        thematicMaterial.docId
      );
      navigate(Route.thematicMaterials);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer className="thematic-material-page">
      {!isLoading && (!thematicMaterial || !author) && (
        <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
          Тематический материал не найден.
        </Typography>
      )}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        thematicMaterial &&
        author && (
          <div className="thematic-material-container">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <Button
                onClick={() => navigate(Route.thematicMaterials)}
                variant="contained"
                startIcon={<ArrowBackIcon />}
                sx={{ width: "min-content" }}
              >
                Вернуться
              </Button>
              {[Role.DOCTOR, Role.CONTENT_MAKER].includes(userInfo.role) && (
                <div style={{ display: "flex", gap: "20px" }}>
                  <Button
                    onClick={openThematicMaterialModal as () => void}
                    variant="contained"
                    color="warning"
                    startIcon={<EditIcon />}
                    sx={{ width: "min-content" }}
                  >
                    Редактировать
                  </Button>
                  <Button
                    onClick={() => deleteThematicMaterial()}
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    sx={{ width: "min-content" }}
                  >
                    Удалить
                  </Button>
                </div>
              )}
            </div>
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
                <div className="description">
                  {thematicMaterial.description}
                </div>
              </div>
            </CardContainer>
            <CardContainer className="thematic-material-body">
              {!isEditMode &&
                [Role.DOCTOR, Role.CONTENT_MAKER].includes(userInfo.role) && (
                  <EditButton onClick={handleThematicMaterialEdit} />
                )}
              {isEditMode ? (
                <form className="edit-form" onSubmit={handleSubmit}>
                  <TextField
                    multiline
                    label="Текст статьи"
                    name="content"
                    value={newContent}
                    onChange={handleFieldChange}
                    fullWidth
                    margin="normal"
                    disabled={isFormSaving}
                  />
                  <div className="controls">
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      disabled={isFormSaving}
                    >
                      Отмена
                    </Button>
                    {isFormSaving ? (
                      <LoadingSpinner style={{ margin: "0", width: "100px" }} />
                    ) : (
                      <Button
                        variant="outlined"
                        type="submit"
                        disabled={
                          formatContent(thematicMaterial.content) ===
                            formatContent(newContent) || isFormSaving
                        }
                      >
                        Подтвердить
                      </Button>
                    )}
                  </div>
                </form>
              ) : (
                ReactHtmlParser(thematicMaterial.content)
              )}
            </CardContainer>
            {/* todo comments for thematic material page */}
            {/*<CardContainer className="comments" title="Комментарии">*/}
            {/*{thematicMaterial.comments.map((comment) => (*/}
            {/*  <div key={comment.message.createdAt}>{JSON.stringify(comment, null, '  ')}</div>*/}
            {/*))}*/}
            {/*</CardContainer>*/}
            <ThematicMaterialEditModal
              isOpen={isThematicMaterialModalOpened}
              onClose={closeThematicMaterialModal as () => void}
              submitThematicMaterial={submitThematicMaterial}
              selectedThematicMaterial={thematicMaterial}
            />
          </div>
        )
      )}
    </PageContainer>
  );
};
