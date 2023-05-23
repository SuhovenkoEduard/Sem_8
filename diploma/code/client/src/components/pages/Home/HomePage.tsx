import React from "react";
import { useNavigate } from "react-router-dom";
import { Route } from "components/routing";
import { Button } from "@mui/material";

import "./home.scss";

export const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="home-page">
      <h2 className="title">Добро пожаловать в дневник диабетика</h2>
      <div className="logo">
        <img
          src="/logo512.png"
          alt="home-page-logo"
          width="300px"
          height="300px"
        />
      </div>
      <div className="controls">
        <Button variant="outlined" onClick={() => navigate(Route.signIn)}>
          Войти
        </Button>
        <Button variant="outlined" onClick={() => navigate(Route.signUp)}>
          Зарегистрироваться
        </Button>
      </div>
    </div>
  );
};
