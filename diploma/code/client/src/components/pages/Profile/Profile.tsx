import React, { useEffect } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { APP_ROUTES } from "components/routing";
import { useNavigate } from "react-router-dom";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { auth } from "firebase_config";
import { NotificationManager } from "react-notifications";
import { LoadingSpinner } from "components/ui/LoadingSpinner";
import { useAppDispatch } from "store/store";
import { ACTION_NAMES } from "store/reducers/user/constants";

export const Profile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [signOut, loading, error] = useSignOut(auth);

  const onSignOut = async () => {
    await signOut();
    dispatch({ type: ACTION_NAMES.userSignOut });
    NotificationManager.success("Sign out successful!");
    navigate(APP_ROUTES.auth);
  };

  useEffect(() => {
    if (error) {
      NotificationManager.error(error?.name, error?.message);
    }
  }, [error]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Container sx={{ p: 10 }}>
        <Grid container spacing={2}>
          <Grid>
            <Typography variant="h1">User Profile</Typography>
            <Typography variant="h6">
              {JSON.stringify(user, null, "  ")}
            </Typography>
            <Button
              sx={{ mt: 3, mb: 2 }}
              variant="contained"
              onClick={() => navigate(APP_ROUTES.home)}
            >
              Back Home
            </Button>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <Button
                sx={{ mt: 3, mb: 2 }}
                variant="contained"
                onClick={onSignOut}
              >
                Sign out
              </Button>
            )}
          </Grid>
          <Grid>
            <img
              src="https://cdn.pixabay.com/photo/2017/03/09/12/31/error-2129569__340.jpg"
              alt=""
              width={500}
              height={250}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
