import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { isMobile } from "react-device-detect";
import { useSelector } from "react-redux";
import { getUserInfoSelector } from "store/selectors";
import { getUserFullName } from "firestore/helpers";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import { Route } from "components/routing";
import { convertRoleToRussian } from "firestore/converters";

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<MuiAppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  display: "flex",
  justifyContent: "center",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

export const AppTitle = ({
  title,
  isNavBarOpened,
  setIsNavBarOpened,
}: {
  title: string;
  isNavBarOpened: boolean;
  setIsNavBarOpened: React.Dispatch<boolean>;
}) => {
  const toggleDrawer = () => {
    setIsNavBarOpened(!isNavBarOpened);
  };

  const userInfo = useSelector(getUserInfoSelector);
  const navigate = useNavigate();

  const onProfileClick = () => {
    setIsNavBarOpened(false);
    navigate(Route.profile);
  };

  return (
    <AppBar sx={{ width: "100%", height: "60px !important" }}>
      <Toolbar>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "20px",
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          {title}
        </Typography>
        {!isMobile && (
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            onClick={onProfileClick}
            sx={{
              marginRight: "10px",
              userSelect: "none",
              ":hover": { cursor: "pointer" },
            }}
          >
            {getUserFullName(userInfo)} ({convertRoleToRussian(userInfo.role)})
          </Typography>
        )}
        <IconButton onClick={onProfileClick}>
          <Avatar src={userInfo.imageUrl} alt={getUserFullName(userInfo)} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
