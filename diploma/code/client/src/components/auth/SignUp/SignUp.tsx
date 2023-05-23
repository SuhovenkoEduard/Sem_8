import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { Route } from "components/routing";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firebaseConfig } from "firebase_config";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import { LoadingSpinner } from "components/ui/LoadingSpinner";
import { successfulAuth, successfulSignUp } from "helpers/auth.helpers";
import { isMobile } from "react-device-detect";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Role } from "firestore/types/collections.types";
import { convertRoleToRussian } from "firestore/converters";
import { firebaseRepositories } from "firestore/data/repositories";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseApp2 = initializeApp(firebaseConfig, "user_creation");
const auth2 = getAuth(firebaseApp2);

export const SignUp = () => {
  const formRef = useRef<HTMLFormElement>();
  const getFormField = (name: string): string => {
    const data = new FormData(formRef.current);
    return data.get(name)?.toString() || "";
  };

  const [role, setRole] = useState<Role>(Role.PATIENT);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [createUserWithEmailAndPassword, , loading, error] =
    useCreateUserWithEmailAndPassword(auth2);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const firstName = getFormField("firstName");
      const lastName = getFormField("lastName");
      const email = getFormField("email");
      const password = getFormField("password");
      const relativePatientId = getFormField("relativePatientId");
      const diabetType = +getFormField("diabetType");
      if (role === Role.RELATIVE) {
        if (!relativePatientId) {
          NotificationManager.error(
            "Код приглашения не может быть пустым",
            "Авторизация"
          );
          return;
        }
        const patient = await firebaseRepositories.users.getDocById(
          relativePatientId
        );
        if (!patient) {
          NotificationManager.error(
            "Неправильный код приглашения",
            "Авторизация"
          );
          return;
        }
      }

      const userCredential = await createUserWithEmailAndPassword(
        email,
        password
      );
      await auth2.signOut();

      if (userCredential) {
        await successfulSignUp({
          firstName,
          lastName,
          email,
          password,
          role,
          relativePatientId,
          diabetType,
          userCredential,
        });
        await signInWithEmailAndPassword(auth, email, password);
        await successfulAuth(userCredential, navigate);
      }
    } catch (e) {
      console.log(e);
      NotificationManager.error(
        "Создание нового пользователя",
        "Ошибка при регистрации"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      NotificationManager.error(error?.name, error?.message);
    }
  }, [error]);

  const [isSignUpDisabled, setIsSignUpDisabled] = useState<boolean>(true);
  const [arePasswordsEqual, setArePasswordsEqual] = useState<boolean>(true);

  const updateUpSignInDisabled = (
    currentRole: Role = getFormField("role") as Role
  ) => {
    const email = getFormField("email");
    const firstName = getFormField("firstName");
    const lastName = getFormField("lastName");
    const password = getFormField("password");
    const password2 = getFormField("password2");
    const relativePatientId = getFormField("relativePatientId");

    setArePasswordsEqual(password === password2);
    setIsSignUpDisabled(
      [
        email,
        firstName,
        lastName,
        password,
        password2,
        (!!relativePatientId && currentRole === Role.RELATIVE) ||
          currentRole === Role.PATIENT,
      ]
        .map(Boolean)
        .some((value) => !value) || password != password2
    );
  };

  const handleRoleChange = (event: SelectChangeEvent) => {
    const newRole = event.target.value as Role;
    setRole(newRole);
    updateUpSignInDisabled(newRole);
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: "url(/images/sign-up-background-min.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        square
        sx={{
          p: (_theme) => _theme.spacing(2),
          display: "flex",
          alignItems: isMobile ? "center" : undefined,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Регистрация
          </Typography>
          <Box
            ref={formRef}
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  disabled={loading || isLoading}
                  label="Имя"
                  autoFocus
                  onChange={() => updateUpSignInDisabled()}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Фамилия"
                  name="lastName"
                  disabled={loading || isLoading}
                  autoComplete="family-name"
                  onChange={() => updateUpSignInDisabled()}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  disabled={loading || isLoading}
                  label="Электронная почта"
                  name="email"
                  autoComplete="email"
                  onChange={() => updateUpSignInDisabled()}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Пароль"
                  type="password"
                  id="password"
                  disabled={loading || isLoading}
                  autoComplete="new-password"
                  onChange={() => updateUpSignInDisabled()}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  error={!arePasswordsEqual}
                  name="password2"
                  label="Повторённый пароль"
                  type="password"
                  id="password2"
                  disabled={loading || isLoading}
                  autoComplete="repeat-password"
                  onChange={() => updateUpSignInDisabled()}
                  helperText={!arePasswordsEqual && "Пароли должны совпадать!"}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="role-select-label">Роль</InputLabel>
                  <Select
                    labelId="role-select-label"
                    value={role}
                    name="role"
                    label="Роль"
                    disabled={loading || isLoading}
                    onChange={handleRoleChange}
                  >
                    {[Role.PATIENT, Role.RELATIVE].map((currentRole) => (
                      <MenuItem key={currentRole} value={currentRole}>
                        {convertRoleToRussian(currentRole)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {role === Role.PATIENT && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="diabet-type-select-label">
                      Тип диабета
                    </InputLabel>
                    <Select
                      labelId="diabet-type-select-label"
                      name="diabetType"
                      defaultValue={1}
                      label="Тип диабета"
                      disabled={loading || isLoading}
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
              {role === Role.RELATIVE && (
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="relativePatientId"
                    label="Код приглашения"
                    disabled={loading || isLoading}
                    onChange={() => updateUpSignInDisabled()}
                  />
                </Grid>
              )}
            </Grid>
            {loading || isLoading ? (
              <LoadingSpinner />
            ) : (
              <Button
                disabled={isSignUpDisabled}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Зарегистрироваться
              </Button>
            )}
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href={Route.signIn} variant="body2">
                  Уже есть аккаунт? Войдите
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
