import * as React from 'react'
import styled from 'react-emotion';
import SiderDrawer from '../common/SiderDrawer';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import FriendLink from './FriendLink';

const FooterContainer = styled.div`
  background: #eee;
  text-align: center;
  padding: 20px 0;
  font-size: 12px;
`

const FriendLinkGroup = styled.ul`
  padding-top: 1em;
  padding-bottom: 1em;
  padding-left: 2em;
`

@observer
export default class Footer extends React.Component {
  @observable friendLinkOpen: boolean = false

  @action.bound friendLinkClick() {
    this.friendLinkOpen = true
  }

  @action.bound friendLinkClose() {
    this.friendLinkOpen = false
  }

  render() {
    return (
      <FooterContainer>
        <div>Made&Design with ❤ By XGHeaven, Powered by React/Mobx/Parcel</div>
        <div>这是我的个人主页，想阅读我的博文，请前往我的 <a href="http://blog.xgheaven.com" target="_blank">Blog</a></div>
        <div>
          <a href="javascript:void 0;" onClick={this.friendLinkClick}>友情链接</a>
        </div>
        <SiderDrawer open={this.friendLinkOpen} onClose={this.friendLinkClose}>
          <h3>友情链接</h3>
          <FriendLinkGroup>
            <FriendLink name="Sen Mu's Personal Website" author="Senevan" link="http://blog.senevan.com/"/>
            <FriendLink name="CodeSky 代码之空" author="敖天羽" link="https://www.codesky.me"/>
          </FriendLinkGroup>
        </SiderDrawer>
      </FooterContainer>
    )
  }
}
