import React, { FC, useState } from "react";
import styled from "@emotion/styled";
import SiderDrawer from "../common/SiderDrawer";
import { observer } from "mobx-react";
import { observable, action } from "mobx";
import FriendLink from "./FriendLink";

const FooterContainer = styled.div`
  text-align: center;
  padding: 20px 0;
  font-size: 12px;
`;

const FriendLinkGroup = styled.ul`
  padding-top: 1em;
  padding-bottom: 1em;
  padding-left: 2em;
`;

const Footer: FC = () => {
  const [friendLinkOpen, setFriendLinkOpen] = useState(false);

  const friendLinkClick = () => {
    console.log(friendLinkOpen);
    setFriendLinkOpen(true);
  };

  const friendLinkClose = () => {
    setFriendLinkOpen(false);
  };

  return (
    <FooterContainer className="text-gray-700 bg-slate-200 leading-normal">
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
        <a onClick={friendLinkClick}>友情链接</a>
      </div>
      <div>Powered by React/Mobx/Vite/Tailwind</div>
      <SiderDrawer open={friendLinkOpen} onClose={friendLinkClose}>
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
};

export default Footer;
