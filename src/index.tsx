import React from "react";
import ReactDOM from "react-dom";

import { ToastContextProvider } from "./toast-context";
import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <ToastContextProvider>
    <App />
  </ToastContextProvider>,
  rootElement
);
