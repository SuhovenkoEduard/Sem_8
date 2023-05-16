import React, { useState } from "react";
import {
  Box,
  Grid,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
} from "@mui/material";
import { isMobile } from "react-device-detect";
import { useWindowSize } from "hooks/useWindowSize";
import {
  NavBarItem,
  topNavbarItems,
  navBarItems,
  bottomNavBarItems,
} from "components/layout/Navbar/constants";
import { useNavigate } from "react-router-dom";
import { User } from "firestore/types/collections.types";
import { GlobalState } from "store";
import { useSelector } from "react-redux";

import "./navbar.scss";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(!isMobile);

  const [width] = useWindowSize();

  const navigate = useNavigate();

  const user = useSelector<GlobalState, User>(
    (state) => state.currentUser.user as User
  );

  const navBarComponent = (navBarItem: NavBarItem) => (
    <ListItem
      button
      key={navBarItem.id}
      onClick={() => navigate(navBarItem.route)}
      className="item-container"
    >
      <ListItemIcon className="item-icon">{navBarItem.icon}</ListItemIcon>
      <ListItemText primary={navBarItem.label} className="item-text" />
    </ListItem>
  );

  const mapNavBarItems = (items: NavBarItem[]) =>
    items
      .filter((navBarItem) => navBarItem.roles.includes(user.role))
      .map(navBarComponent);

  const list = (
    <Box
      sx={{ width: isMobile ? 250 : (width / 12) * 2, minWidth: 170 }}
      role="presentation"
      onClick={() => {}}
      onKeyDown={() => {}}
      className="navbar-container"
    >
      {mapNavBarItems(topNavbarItems)}
      {mapNavBarItems(navBarItems)}
      {mapNavBarItems(bottomNavBarItems)}
    </Box>
  );

  return (
    <Grid item xs={isMobile ? undefined : 2}>
      <SwipeableDrawer
        variant={isMobile ? "temporary" : "permanent"}
        anchor="left"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onOpen={() => setIsOpen(true)}
      >
        {list}
      </SwipeableDrawer>
    </Grid>
  );
};
