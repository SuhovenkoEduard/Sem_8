import React from "react";
import {
  Box,
  Grid,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
} from "@mui/material";
import { isMobile } from "react-device-detect";
import { useWindowSize } from "hooks/useWindowSize";
import { NavBarItem, navBarItems } from "components/layout/Navbar/constants";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "firestore/types/collections.types";
import { GlobalState } from "store";
import { useSelector } from "react-redux";

import "./navbar.scss";

export const Navbar = ({
  isNavBarOpened,
  setIsNavBarOpened,
}: {
  isNavBarOpened: boolean;
  setIsNavBarOpened: React.Dispatch<boolean>;
}) => {
  const [width] = useWindowSize();

  const navigate = useNavigate();

  const user = useSelector<GlobalState, User>(
    (state) => state.currentUser.user as User
  );

  const location = useLocation();

  const navBarComponent = (navBarItem: NavBarItem) => (
    <ListItemButton
      key={navBarItem.id}
      onClick={() => {
        if (isMobile) {
          setIsNavBarOpened(false);
        }
        navigate(navBarItem.route);
      }}
      className="item-container"
      selected={location.pathname.startsWith(navBarItem.route)}
    >
      <ListItemIcon className="item-icon">{navBarItem.icon}</ListItemIcon>
      <ListItemText primary={navBarItem.label} className="item-text" />
    </ListItemButton>
  );

  const mapNavBarItems = (items: NavBarItem[]) =>
    items
      .filter((navBarItem) => navBarItem.roles.includes(user.role))
      .map(navBarComponent);

  const list = (
    <Box
      sx={{
        width: isMobile ? 250 : (width / 12) * 2,
        minWidth: 170,
        marginTop: "60px",
      }}
      role="presentation"
      className="navbar-items-container"
    >
      {mapNavBarItems(navBarItems)}
    </Box>
  );

  return (
    <Grid item xs={isMobile ? undefined : 2}>
      <SwipeableDrawer
        variant={isMobile ? "temporary" : "permanent"}
        anchor="left"
        open={isNavBarOpened}
        onClose={() => setIsNavBarOpened(false)}
        onOpen={() => setIsNavBarOpened(true)}
      >
        {list}
      </SwipeableDrawer>
    </Grid>
  );
};
