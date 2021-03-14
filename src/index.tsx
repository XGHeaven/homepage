import type {} from "@emotion/react/types/css-prop";

import "./gtag";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "mobx-react";

import App from "./component/App";
import { Global } from "@emotion/react";
import { globalStyle } from "./style/global";
import { GlobalStore } from "./store/global";

const globalStore = new GlobalStore();

ReactDOM.render(
  <Provider global={globalStore}>
    <Global styles={globalStyle} />
    <App />
  </Provider>,
  document.getElementById("app")
);
