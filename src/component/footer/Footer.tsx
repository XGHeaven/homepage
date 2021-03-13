import * as React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import SiderDrawer from "../common/SiderDrawer";
import { observer } from "mobx-react";
import { observable, action } from "mobx";
import FriendLink from "./FriendLink";

const FooterContainer = styled.div`
  background: #eee;
  text-align: center;
  padding: 20px 0;
  font-size: 12px;
  line-height: 1.5;
`;

const FriendLinkGroup = styled.ul`
  padding-top: 1em;
  padding-bottom: 1em;
  padding-left: 2em;
`;

@observer
export default class Footer extends React.Component {
  @observable friendLinkOpen: boolean = false;

  @action.bound friendLinkClick() {
    this.friendLinkOpen = true;
  }

  @action.bound friendLinkClose() {
    this.friendLinkOpen = false;
  }

  render() {
    return (
      <FooterContainer>
        <div>Made&Design with ❤ By Myself</div>
        <div>
          本主页已
          <a href="https://github.com/XGHeaven/homepage" target="_blank">
            开源
          </a>
          ，想阅读我的博文，请前往我的{" "}
          <a href="http://blog.xgheaven.com" target="_blank">
            Blog
          </a>
        </div>
        <div>
          <a onClick={this.friendLinkClick}>友情链接</a>
          &nbsp; | &nbsp;
          <a href="http://www.beian.miit.gov.cn/">浙ICP备15045223号</a>
        </div>
        <div>Powered by React/Mobx/Parcel</div>
        <SiderDrawer open={this.friendLinkOpen} onClose={this.friendLinkClose}>
          <h3>友情链接</h3>
          <FriendLinkGroup>
            <FriendLink
              name="Sen Mu's Personal Website"
              author="Senevan"
              link="http://blog.senevan.com/"
            />
            <FriendLink
              name="CodeSky 代码之空"
              author="敖天羽"
              link="https://www.codesky.me"
            />
            <FriendLink
              name="Calpa's Blog"
              author="Calpa"
              link="https://calpa.me"
            />
            <FriendLink
              name="Mayne's Blog"
              author="Mayne"
              link="https://gine.me"
            />
            <FriendLink
              name="Ahonn's Blog"
              author="Ahonn"
              link="https://www.ahonn.me"
            />
          </FriendLinkGroup>
        </SiderDrawer>
      </FooterContainer>
    );
  }
}
