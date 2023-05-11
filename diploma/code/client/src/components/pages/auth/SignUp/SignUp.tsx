import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { APP_ROUTES } from "components/routing";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "firebase_config";
import { useEffect, useRef, useState } from "react";
import { FormHelperText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import { LoadingSpinner } from "components/ui/LoadingSpinner";
import { successfulAuth, successfulSignUp } from "helpers/auth.helpers.tmp";
import { Copyright } from "components/pages/auth";

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

    console.log({
      firstName,
      lastName,
      email,
      password,
    });
  };

  useEffect(() => {
    if (error) {
      NotificationManager.error(error?.name, error?.message);
    }
  }, [error]);

  const [arePasswordsEqual, setArePasswordsEqual] = useState<boolean>(true);

  const onRepeatedPasswordChange = () => {
    const password = getFormField("password");
    const repeatedPassword = getFormField("password2");
    setArePasswordsEqual(password === repeatedPassword);
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: "url(../images/sign-up-background.jpg)",
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
        sx={{ p: (_theme) => _theme.spacing(2) }}
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        square
      >
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
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
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  error={!arePasswordsEqual}
                  name="password2"
                  label="Repeated password"
                  type="password"
                  id="password2"
                  autoComplete="repeat-password"
                  onChange={onRepeatedPasswordChange}
                />
                {!arePasswordsEqual && (
                  <FormHelperText>Passwords must be equal!</FormHelperText>
                )}
              </Grid>
            </Grid>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <Button
                disabled={
                  !arePasswordsEqual ||
                  !getFormField("password") ||
                  !getFormField("password2")
                }
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
            )}
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href={APP_ROUTES.signIn} variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Grid>
    </Grid>
  );
};
