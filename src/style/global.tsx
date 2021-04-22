import { css } from "@emotion/react";
import { CLink, CLinkHover } from "./color";
import "github-markdown-css/github-markdown.css";

export const globalStyle = css`
  html,
  body {
    -webkit-font-smoothing: antialiased;
    font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, Tahoma,
      PingFang SC, Microsoft Yahei, Arial, Hiragino Sans GB, sans-serif;
    padding: 0;
    margin: 0;
  }

  * {
    box-sizing: border-box;
  }

  a {
    color: ${CLink};
    text-decoration: none;
    &:hover {
      color: ${CLinkHover};
    }
  }
`;
