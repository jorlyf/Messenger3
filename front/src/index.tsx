import * as React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";

import store from "./redux/store";

import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) { throw new Error("root div not found"); }

const root = createRoot(rootElement);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);