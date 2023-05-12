import React from "react";
import { NotificationContainer } from "react-notifications";
import { AppRoutes } from "components/routing";

import "./app.scss";

export const App = () => {
  return (
    <div className="App">
      <AppRoutes />
      <NotificationContainer />
    </div>
  );
};
