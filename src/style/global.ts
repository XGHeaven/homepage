import { injectGlobal } from 'emotion'

injectGlobal`
html, body {
  -webkit-font-smoothing: antialiased;
  font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, Tahoma, PingFang SC,
    Microsoft Yahei, Arial, Hiragino Sans GB, sans-serif;
  filter: grayscale(1);
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
`
