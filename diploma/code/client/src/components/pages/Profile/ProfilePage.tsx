import React, { useState, useEffect, useMemo } from "react";
import { TextField, Button, Card, CardMedia } from "@mui/material";
import { useSelector } from "react-redux";
import { GlobalState, useAppDispatch } from "store";
import { User } from "firestore/types/collections.types";
import {
  convertRoleToRussian,
  convertUserDataToUserInfo,
  convertUserInfoToUserData,
  convertUserToUserInfo,
  UserData,
} from "firestore/converters";
import { PageContainer } from "components/layout";
import { isMobile } from "react-device-detect";
import { ProfileFormErrors } from "firestore/types/client.types";
import { deepCopy } from "deep-copy-ts";
import { ImageUploader } from "./ImageUploader";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "firebase_config";
import { firebaseRepositories } from "firestore/data/repositories";
import { fetchUser } from "store/reducers/user/actions";
import { NotificationManager } from "react-notifications";
import { LoadingSpinner } from "components/ui/LoadingSpinner";
import { setUser } from "store/reducers/user/userSlice";
import { deepEqual } from "ts-deep-equal";
import { EditButton } from "components/ui/EditButton";

import "./profile-page.scss";

const validationObj: {
  [key: string]: (s: string) => string | null;
} = {
  address: (address: string) => {
    const addressRegex = /[A-Za-zА-Яа-я]{5,}/;
    const errorMessage = "Адрес должен содержать хотя бы 5 символов";
    return addressRegex.test(address) ? null : errorMessage;
  },
  firstName: (firstName: string) => {
    const nameRegex = /\S+/;
    const errorMessage = "Имя должно содержать хотя бы 1 символ";
    return nameRegex.test(firstName) ? null : errorMessage;
  },
  lastName: (lastName: string) => {
    const nameRegex = /\S+/;
    const errorMessage = "Фамилия должна содержать хотя бы 1 символ";
    return nameRegex.test(lastName) ? null : errorMessage;
  },
  phone: (phone: string) => {
    const phoneRegex = /^\+375-\d{2}-\d{7}$/;
    const errorMessage = "Номер должен быть формата +375-XX-XXXXXXX";
    return phoneRegex.test(phone) ? null : errorMessage;
  },
};

const emptyErrors: ProfileFormErrors = {
  firstName: null,
  lastName: null,
  address: null,
  phone: null,
};

export const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();

  // redux state
  const user = useSelector<GlobalState, User>(
    (state) => state.currentUser.user as User
  );
  const originalUserInfo = useMemo(() => convertUserToUserInfo(user), [user]);

  // local state
  const [isEditMode, setIsEditMode] = useState(false);
  const [userData, setUserData] = useState<UserData>(
    convertUserInfoToUserData(originalUserInfo)
  );
  const [errors, setErrors] = useState<ProfileFormErrors>(
    deepCopy(emptyErrors)
  );
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const [isFormSaving, setIsFormSaving] = useState<boolean>(false);

  // effects
  useEffect(
    () => setUserData(convertUserInfoToUserData(originalUserInfo)),
    [originalUserInfo]
  );

  useEffect(() => {
    const newErrors = Object.fromEntries(
      Object.keys(validationObj).map((key) => [
        key,
        validationObj[key](userData[key as keyof UserData]),
      ])
    ) as unknown as ProfileFormErrors;
    setErrors(newErrors);
    setIsSubmitDisabled(
      Object.values(newErrors).some((value) => !!value) ||
        deepEqual(userData, convertUserInfoToUserData(originalUserInfo))
    );
  }, [userData, originalUserInfo]);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditButtonClick = () => {
    setIsEditMode(true);
  };

  const handleCancelButtonClick = () => {
    setUserData(convertUserInfoToUserData(originalUserInfo));
    setIsEditMode(false);
  };

  const onImageUpload = async (pictureFiles: File[]) => {
    if (!pictureFiles.length) {
      return;
    }

    try {
      setIsImageLoading(true);
      const [image] = pictureFiles;
      const fileRef = ref(storage, image.name);
      const snapshot = await uploadBytes(fileRef, image);
      const imageUrl = await getDownloadURL(snapshot.ref);

      const newUser = deepCopy(user);
      newUser.imageUrl = imageUrl;
      await firebaseRepositories.users.updateDoc(newUser);
      await dispatch(fetchUser(newUser.docId));
    } catch (e) {
      console.log(e);
      NotificationManager.error(
        "Сохранение изображения",
        '[Ошибка на странице "профиль"]'
      );
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsFormSaving(true);

      const newUser = {
        ...user,
        ...convertUserDataToUserInfo(userData),
      };
      await firebaseRepositories.users.updateDoc(newUser);
      await dispatch(fetchUser(newUser.docId));
    } catch (err) {
      dispatch(
        setUser({
          ...user,
          ...originalUserInfo,
        })
      );
      console.log(err);
      NotificationManager.error(
        "Сохранение данных профиля",
        '[Ошибка на странице "профиль"]'
      );
    } finally {
      setIsFormSaving(false);
      setIsEditMode(false);
    }
  };

  return (
    <PageContainer>
      <div className="profile-page">
        <div
          className="profile-page-content"
          style={{ flexWrap: isMobile ? "wrap" : undefined }}
        >
          <div className="profile-image-container">
            <Card
              className="profile-image-card"
              style={{ width: "300px", height: "250px" }}
            >
              <CardMedia
                component="img"
                height="100%"
                width="100%"
                sx={{ objectFit: "cover" }}
                image={userData.imageUrl}
                alt="Profile Image"
              />
            </Card>
            {isImageLoading ? (
              <LoadingSpinner style={{ marginTop: "20px" }} />
            ) : (
              <ImageUploader onDrop={onImageUpload} />
            )}
          </div>
          {!isEditMode ? (
            <Card className="profile-info-container">
              <div className="profile-info-container__title">
                <h2>{`${userData.firstName} ${userData.lastName}`}</h2>
                <EditButton onClick={handleEditButtonClick} />
              </div>
              <p>Эл. почта: {userData.email}</p>
              <p>Телефон: {userData.phone}</p>
              <p>Адрес: {userData.address}</p>
              <p>Тип учётной записи: {convertRoleToRussian(userData.role)}</p>
              <p className="role-logo-container">
                <img src={`/images/logos/${userData.role}-logo.png`} alt="" />
              </p>
            </Card>
          ) : (
            <Card className="edit-form-container">
              <form className="edit-form" onSubmit={handleSubmit}>
                <TextField
                  label="Имя"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleFieldChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  disabled={isFormSaving}
                />
                <TextField
                  label="Фамилия"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleFieldChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  disabled={isFormSaving}
                />
                <TextField
                  label="Телефон"
                  name="phone"
                  value={userData.phone}
                  onChange={handleFieldChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.phone}
                  helperText={errors.phone}
                  disabled={isFormSaving}
                />
                <TextField
                  label="Эл. почта"
                  name="email"
                  value={userData.email}
                  onChange={handleFieldChange}
                  fullWidth
                  margin="normal"
                  disabled={true}
                />
                <TextField
                  label="Адрес"
                  name="address"
                  value={userData.address}
                  onChange={handleFieldChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.address}
                  helperText={errors.address}
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
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
};
