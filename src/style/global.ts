import { injectGlobal } from 'emotion'

injectGlobal`
html, body {
  -webkit-font-smoothing: antialiased;
  font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, Tahoma, PingFang SC,
    Microsoft Yahei, Arial, Hiragino Sans GB, sans-serif;
}
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
`

import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/css/fontawesome.css'
