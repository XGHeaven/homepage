import * as React from "react";
import FirstPage from "./first-page/FirstPage";
import Stage from "./stage/Stage";
import Footer from "./footer/Footer";
import { STAGE_COLOR_1, STAGE_COLOR_2, STAGE_COLOR_3, STAGE_COLOR_4 } from "../style/variable";
import AboutMe from "./stage/AboutMe";
import MyProject from "./stage/MyProject";

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
        bgImage="//s2.ax1x.com/2019/08/28/moJeN4.jpg"
      >
        <MyProject/>
      </Stage>
      <Stage
        direction="left"
        title="工具"
        primaryColor={STAGE_COLOR_2}
        bgImage="//s2.ax1x.com/2019/08/28/moJQjx.jpg"
      >
        <MyTools/>
      </Stage>
      <Stage
        direction="right"
        title="娱乐"
        primaryColor={STAGE_COLOR_3}
        bgImage="//s2.ax1x.com/2019/08/28/moJK3R.png"
      >
        <MyGame/>
      </Stage>
      <Stage
        direction="left"
        title="我"
        primaryColor={STAGE_COLOR_4}
        bgImage="//s2.ax1x.com/2019/08/28/moJuC9.jpg"
      >
        <AboutMe/>
      </Stage>
      <Footer/>
    </React.Fragment>
  )
}
