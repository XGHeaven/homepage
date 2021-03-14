import * as React from "react";
import styled from "@emotion/styled";
import {
  PRIMARY_COLOR,
  RED_COLOR,
  GREEN_COLOR,
  BLUE_COLOR,
} from "../../style/variable";
import CarouselText from "../common/CarouselText";
import { throttle, clamp } from "lodash-es";
import BarMenu from "../common/NavMenuItem";
import Contact from "../common/Contact";
import { rgb } from "color";

import AvatarImg from "../../asset/image/avatar.jpg";
import BackgroundImg from "../../asset/image/background.jpg";
import { NavMenu } from "../common/NavMenu";
import { inject, observer } from "mobx-react";
import { GlobalStore } from "../../store/global";

const FullScreen = styled.div`
  width: 100%;
  height: 100vh;
  background: ${PRIMARY_COLOR};
  background-image: url("${BackgroundImg}");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-blend-mode: difference;
  display: flex;
  flex-direction: column;
`;

const MainTitle = styled.div`
  color: white;
  font-size: 64px;
  text-align: center;
  transform: translateZ(80px);
  text-shadow: 0 16px 8px rgba(0, 0, 0, 0.5);
  font-family: cursive;
  font-weight: bold;
  padding: 0 16px;

  @media (max-width: 768px) {
    font-size: 10vw;
  }
`;

const SubTitle = styled.div`
  color: white;
  font-size: 32px;
  text-align: center;
  transform: translateZ(30px);
  font-family: cursive;

  @media (max-width: 768px) {
    font-size: 5vw;
    margin-top: 12px;
  }
`;

const NavBar = styled.div`
  width: 100%;
  flex: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  line-height: 48px;
`;

const RIP = styled.div`
  color: white;
  padding: 0 16px;
  line-height: 48px;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  border-top-right-radius: 24px;
  border-bottom-right-radius: 24px;
`;

const MainContainer = styled.div`
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transform-style: preserve-3d;
  perspective: 800px;
  transition: all 0.3s;
`;

const Avatar = styled.img`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 2px solid white;
  margin-top: 64px;
  transform: translateZ(60px);
`;

const ContactContainer = styled.div`
  margin-top: 40px;
  transform: translateZ(30px);
`;

const ContactLink = styled.a`
  display: block;
  color: white;
  &:hover {
    color: lightgray;
  }
`;

const RedText = styled.span`
  color: ${RED_COLOR};
  text-shadow: 0 16px 8px ${rgb(RED_COLOR).alpha(0.3).toString()};
`;
const GreenText = styled.span`
  color: ${GREEN_COLOR};
  text-shadow: 0 16px 8px ${rgb(GREEN_COLOR).alpha(0.3).toString()};
`;
const BlueText = styled.span`
  color: ${BLUE_COLOR};
  text-shadow: 0 16px 8px ${rgb(BLUE_COLOR).alpha(0.3).toString()};
`;

@inject("global")
@observer
export default class FirstPage extends React.Component<{
  global: GlobalStore;
}> {
  private timer: any;
  private ref!: HTMLDivElement;
  gamma: number = 0;
  beta: number = 0;
  initGamma = NaN;
  initBeta = NaN;

  componentDidMount() {
    window.addEventListener("deviceorientation", this.onDeviceMove);
  }

  componentWillUnmount() {
    window.removeEventListener("deviceorientation", this.onDeviceMove);
  }

  onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    this.doMove(e.pageX, e.pageY);
  };

  onDeviceMove = (e: DeviceOrientationEvent) => {
    const { gamma, beta } = e;

    if (Number.isNaN(this.initGamma) || Number.isNaN(this.initBeta)) {
      this.initGamma = gamma!;
      this.initBeta = beta!;
      this.gamma = gamma!;
      this.beta = beta!;
      return;
    }

    const deltaGamma = gamma! - this.gamma;
    const deltaBeta = beta! - this.beta;

    if (Math.abs(deltaGamma) < 0.2 && Math.abs(deltaBeta) < 0.2) {
      // 超过阈值之后进行操作
      return;
    }

    const x = clamp(
      (((gamma! - this.initGamma) * 0.05 + 1) * window.innerWidth) / 2,
      0,
      window.innerWidth * 2
    );
    const y = clamp(
      (((beta! - this.initBeta) * 0.05 + 1) * window.innerHeight) / 2,
      0,
      window.innerHeight * 2
    );
    this.gamma = gamma!;
    this.beta = beta!;
    this.doMove(x, y);
  };

  doMove = throttle((x, y) => {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    const ref = this.ref;

    ref.style.perspectiveOrigin = `${x}px ${y}px`;

    this.timer = setTimeout(() => {
      ref.style.perspectiveOrigin = "unset";
      this.initGamma = this.gamma;
      this.initBeta = this.beta;
      this.timer = null;
    }, 1000);
  }, 100);

  render() {
    return (
      <FullScreen onMouseMove={this.onMouseMove}>
        <NavBar>
          <RIP>深切悼念抗疫一线牺牲的英雄</RIP>
          <NavMenu>
            {/* TODO: 主题切换 */}
            <BarMenu
              onClick={() => {
                console.log("change");
              }}
            >
              LIGHT
            </BarMenu>
            <BarMenu href="http://blog.xgheaven.com">BLOG</BarMenu>
          </NavMenu>
        </NavBar>
        <MainContainer ref={(ref) => (this.ref = ref!)}>
          <MainTitle>
            HERE IS <RedText>X</RedText> <GreenText>G</GreenText>AME{" "}
            <BlueText>H</BlueText>EAVEN
          </MainTitle>
          <SubTitle>
            I'm A
            <CarouselText />
          </SubTitle>
          <Avatar src={AvatarImg} />
          <ContactContainer>
            <Contact
              icon="github"
              primaryColor="#333"
              title="Github: @XGHeaven"
              link="https://github.com/XGHeaven"
            />
            <Contact
              icon="weibo"
              primaryColor="#D43437"
              title="微博: @XGHeaven"
              link="https://weibo.com/xgheaven"
            />
            <Contact
              icon="telegram"
              primaryColor="#0088cc"
              title="Telegram: @XGHeaven"
            />
            <Contact
              icon="facebook"
              primaryColor="#3b5998"
              title="Facebook: @XGHeaven"
              link="https://www.facebook.com/profile.php?id=100009593685776"
            />
            <Contact
              icon="twitter"
              primaryColor="#1da1f2"
              title="Twitter: @XGHeaven"
              link="https://twitter.com/XGHeaven"
            />
            <Contact
              icon="steam"
              primaryColor="#000000"
              title="Steam: @XGHeaven(147460341)"
              link="https://steamcommunity.com/id/xgheaven/"
            />
            <Contact
              icon="zhihu"
              primaryColor="#0084ff"
              title="知乎: @XGHeaven"
              link="https://www.zhihu.com/people/XGHeaven/activities"
            />
            <Contact
              icon="bilibili"
              primaryColor="#eb7b99"
              title="Bilibili: @XGHeaven"
              link="https://space.bilibili.com/32059373"
            />
            <Contact
              icon="more"
              primaryColor="black"
              title={
                <div>
                  Others:
                  <br />
                  <ContactLink href="https://juejin.im/user/580e083912396b00308dae0a">
                    掘金: @XGHeaven
                  </ContactLink>
                </div>
              }
            />
          </ContactContainer>
        </MainContainer>
      </FullScreen>
    );
  }
}
