import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { App } from "components/App";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { store } from "store";
import { faker } from "@faker-js/faker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import localeConfig from "dayjs/locale/ru";
import dayjs from "dayjs";

import "./index.scss";

faker.setLocale("ru");
dayjs.locale(localeConfig);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <BrowserRouter>
      <Provider store={store}>
        <CssBaseline />
        <App />
      </Provider>
    </BrowserRouter>
  </LocalizationProvider>
);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register(`https://diabeticdiary-fedb9.firebaseapp.com/service-worker.js`)
    .then(
      (registration) => {
        console.log("Service worker registration succeeded:", registration);
      },
      (error) => {
        console.error(`Service worker registration failed: ${error}`);
      }
    );
} else {
  console.error("Service workers are not supported.");
}
