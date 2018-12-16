import * as React from 'react'
import styled from 'react-emotion';

const FooterContainer = styled.div`
  background: #eee;
  text-align: center;
  padding: 20px 0;
  font-size: 12px;
`

export default function Footer() {
  return (
    <FooterContainer>
      <div>Made with ❤ By XGHeaven, Powered by React/Mobx/Parcel</div>
      <div>这是我的个人主页，想阅读我的博文，请前往我的 <a href="http://blog.xgheaven.com">Blog</a></div>
    </FooterContainer>
  )
}
