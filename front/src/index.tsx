import * as React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";

import store from "./redux/store";

import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) { throw new Error("root element not found"); }

const root = createRoot(rootElement);
root.render(
  <Provider store={store} >
    <App />
  </Provider>
);