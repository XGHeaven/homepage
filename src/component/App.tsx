import * as React from "react";
import FirstPage from "./first-page/FirstPage";
import Stage from "./stage/Stage";
import Footer from "./footer/Footer";
import { STAGE_COLOR_1, STAGE_COLOR_2, STAGE_COLOR_3, STAGE_COLOR_4 } from "../style/variable";
import AboutMe from "./stage/AboutMe";
import MyProject from "./stage/MyProject";

import stageImageOpensource from '../asset/image/project.jpg'
import MyGame from "./stage/MyGame";
import MyTools from "./stage/MyTools";

export default function App() {
  return (
    <React.Fragment>
      <FirstPage/>
      <Stage
        direction="right"
        title="开源"
        primaryColor={STAGE_COLOR_1}
        bgImage="//wx1.sinaimg.cn/mw690/dfc8f9cdly1g21ievmvpgj21hc0tynag.jpg"
      >
        <MyProject/>
      </Stage>
      <Stage
        direction="left"
        title="工具"
        primaryColor={STAGE_COLOR_2}
        bgImage="//wx4.sinaimg.cn/mw690/dfc8f9cdly1g21ifu8zloj21dl0u00ye.jpg"
      >
        <MyTools/>
      </Stage>
      <Stage
        direction="right"
        title="娱乐"
        primaryColor={STAGE_COLOR_3}
        bgImage="//wx3.sinaimg.cn/large/dfc8f9cdly1g21ien6yecj20u00izwna.jpg"
      >
        <MyGame/>
      </Stage>
      <Stage
        direction="left"
        title="我"
        primaryColor={STAGE_COLOR_4}
        bgImage="//wx2.sinaimg.cn/large/dfc8f9cdly1g21iercqgij20wi0ia0yh.jpg"
      >
        <AboutMe/>
      </Stage>
      <Footer/>
    </React.Fragment>
  )
}
