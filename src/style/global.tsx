import { css } from "@emotion/react";
export const globalStyle = css`
  html,
  body {
    -webkit-font-smoothing: antialiased;
    font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, Tahoma,
      PingFang SC, Microsoft Yahei, Arial, Hiragino Sans GB, sans-serif;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  a {
    color: #333333;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;
