import React from "react";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "components/routing";
import { Button, Container } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "firebase_config";

export const Home = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  return (
    <div>
      <Container sx={{ mt: 3, mb: 2 }}>Home page!</Container>
      {user ? (
        <Button
          sx={{ mt: 3, mb: 2 }}
          variant="contained"
          onClick={() => navigate(APP_ROUTES.profile)}
        >
          Profile
        </Button>
      ) : (
        <Button
          sx={{ mt: 3, mb: 2 }}
          variant="contained"
          onClick={() => navigate(APP_ROUTES.auth)}
        >
          Auth
        </Button>
      )}
    </div>
  );
};
