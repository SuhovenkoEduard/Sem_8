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
import { auth } from "firebase_config";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import { LoadingSpinner } from "components/ui/LoadingSpinner";
import { successfulAuth, successfulSignUp } from "helpers/auth.helpers";

export const SignUp = () => {
  const formRef = useRef<HTMLFormElement>();
  const getFormField = (name: string): string => {
    const data = new FormData(formRef.current);
    return data.get(name)?.toString() || "";
  };

  const [createUserWithEmailAndPassword, , loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const firstName = getFormField("firstName");
    const lastName = getFormField("lastName");
    const email = getFormField("email");
    const password = getFormField("password");

    const userCredential = await createUserWithEmailAndPassword(
      email,
      password
    );

    if (userCredential) {
      await successfulAuth(userCredential, navigate);
      await successfulSignUp({ firstName, lastName, userCredential });
    }
  };

  useEffect(() => {
    if (error) {
      NotificationManager.error(error?.name, error?.message);
    }
  }, [error]);

  const [isSignUpDisabled, setIsSignUpDisabled] = useState<boolean>(true);

  const [arePasswordsEqual, setArePasswordsEqual] = useState<boolean>(true);

  const updateUpSignInDisabled = () => {
    const email = getFormField("email");
    const firstName = getFormField("firstName");
    const lastName = getFormField("lastName");
    const password = getFormField("password");
    const password2 = getFormField("password2");
    setArePasswordsEqual(password === password2);
    setIsSignUpDisabled(
      [email, firstName, lastName, password, password2]
        .map(Boolean)
        .some((value) => !value) || password != password2
    );
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
          alignItems: "center",
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
                  label="Имя"
                  autoFocus
                  onChange={updateUpSignInDisabled}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Фамилия"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={updateUpSignInDisabled}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Электронная почта"
                  name="email"
                  autoComplete="email"
                  onChange={updateUpSignInDisabled}
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
                  autoComplete="new-password"
                  onChange={updateUpSignInDisabled}
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
                  autoComplete="repeat-password"
                  onChange={updateUpSignInDisabled}
                  helperText={!arePasswordsEqual && "Пароли должны совпадать!"}
                />
              </Grid>
            </Grid>
            {loading ? (
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
