import React from "react";
import { NotificationContainer } from "react-notifications";
import { AppRoutes } from "components/routing";
import { StreamChat } from "stream-chat";
import * as emailjs from "@emailjs/browser";
import { Streami18n } from "stream-chat-react";
import ruUpdated from "assets/i18/ru.json";

import "containers/App/app.scss";

export const streamClient = StreamChat.getInstance("bq8h3h82pvd8");
export const i18nInstance = new Streami18n({
  language: "ru",
  translationsForLanguage: ruUpdated,
});
emailjs.init("y-xzk78YvyzBfbFUe");

export const App = () => {
  return (
    <div className="App">
      <AppRoutes />
      <NotificationContainer />
    </div>
  );
};
