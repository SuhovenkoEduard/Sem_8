import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { App } from "components/App";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { store } from "store";
import { faker } from "@faker-js/faker";

import "./index.scss";

faker.setLocale("ru");

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <CssBaseline />
      <App />
    </Provider>
  </BrowserRouter>
);
