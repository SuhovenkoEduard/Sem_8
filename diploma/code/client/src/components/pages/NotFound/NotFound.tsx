import React from "react";
import { Button } from "@mui/material";
import { Route } from "components/routing";
import { useNavigate } from "react-router-dom";
import { getUserSelector } from "store/selectors";
import { useSelector } from "react-redux";

import "./not-found.scss";

export const NotFound = () => {
  const navigate = useNavigate();
  const user = useSelector(getUserSelector);
  return (
    <div className="not-found-page">
      <h2 className="title">Страница не найдена :(</h2>
      <div className="image">
        <img
          src="https://cdn1.specialist.ru/Content/Image/News/Small/404-error-s.jpg"
          alt="not-found-image"
          width="300px"
          height="300px"
        />
      </div>
      <div className="controls">
        {user ? (
          <Button variant="outlined" onClick={() => navigate(Route.profile)}>
            Вернуться в профиль
          </Button>
        ) : (
          <Button variant="outlined" onClick={() => navigate(Route.home)}>
            Вернуться на главную
          </Button>
        )}
      </div>
    </div>
  );
};
