import React from "react";
import { useNavigate } from "react-router-dom";
import { Routes } from "components/routing";
import { Button, Container, Grid } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "firebase_config";

export const Home = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  return (
    <Grid sx={{ margin: "auto" }}>
      <Container sx={{ mt: 3, mb: 2 }}>Home page!</Container>
      {user ? (
        <Button
          sx={{ mt: 3, mb: 2 }}
          variant="contained"
          onClick={() => navigate(Routes.profile)}
        >
          Profile
        </Button>
      ) : (
        <Button
          sx={{ mt: 3, mb: 2 }}
          variant="contained"
          onClick={() => navigate(Routes.auth)}
        >
          Auth
        </Button>
      )}
    </Grid>
  );
};
