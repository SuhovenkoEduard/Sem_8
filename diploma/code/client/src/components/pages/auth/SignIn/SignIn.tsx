import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { Route } from "components/routing";
import { useNavigate } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import { auth } from "firebase_config";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useEffect, useRef, useState } from "react";
import { LoadingSpinner } from "components/ui/LoadingSpinner";
import { successfulAuth } from "helpers/auth.helpers";

export const SignIn = () => {
  const navigate = useNavigate();

  const formRef = useRef<HTMLFormElement>();
  const getFormField = (name: string): string => {
    const data = new FormData(formRef.current);
    return data.get(name)?.toString() || "";
  };

  const [signInWithEmailAndPassword, , loading, error] =
    useSignInWithEmailAndPassword(auth);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = getFormField("email");
    const password = getFormField("password");
    const userCredential = await signInWithEmailAndPassword(email, password);
    if (userCredential) {
      await successfulAuth(userCredential, navigate);
    }
  };

  useEffect(() => {
    if (error) {
      NotificationManager.error(error?.name, error?.message);
    }
  }, [error]);

  const [isSignInDisabled, setIsSignInDisabled] = useState<boolean>(false);

  const updateIsSignInDisabled = () => {
    setIsSignInDisabled(!getFormField("email") || !getFormField("password"));
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: "url(/images/sign-in-background-min.jpg)",
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
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Вход
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
            ref={formRef}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Электронная почта"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={updateIsSignInDisabled}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={updateIsSignInDisabled}
            />
            {loading ? (
              <LoadingSpinner />
            ) : (
              <Button
                disabled={isSignInDisabled}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Войти
              </Button>
            )}
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href={Route.signUp} variant="body2">
                  {"Нет аккаунта? Зарегистрируйтесь"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
