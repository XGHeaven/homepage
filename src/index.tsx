import '@emotion/react/types/css-prop'

import "./gtag";

import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./component/App";
import { Global } from "@emotion/react";
import { globalStyle } from "./style/global";

ReactDOM.render(
  <React.Fragment>
    <Global styles={globalStyle} />
    <App />
  </React.Fragment>,
  document.getElementById("app")
);
