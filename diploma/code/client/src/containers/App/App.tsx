import React from "react";
import { NotificationContainer } from "react-notifications";
import { AppRoutes } from "components/routing";
import { StreamChat } from "stream-chat";
import * as emailjs from "@emailjs/browser";

import "containers/App/app.scss";

export const streamClient = StreamChat.getInstance("bq8h3h82pvd8");
emailjs.init("y-xzk78YvyzBfbFUe");

export const App = () => {
  return (
    <div className="App">
      <AppRoutes />
      <NotificationContainer />
    </div>
  );
};
