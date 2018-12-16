import * as React from "react";
import FirstPage from "./first-page/FirstPage";
import Stage from "./stage/Stage";
import Footer from "./footer/Footer";
import { STAGE_COLOR_1, STAGE_COLOR_2, STAGE_COLOR_3, STAGE_COLOR_4 } from "../style/variable";
import AboutMe from "./stage/AboutMe";
import MyProject from "./stage/MyProject";

import stageImageDota2 from '../asset/image/dota2.png'
import stageImageMine from '../asset/image/mine.jpg'
import stageImageOpensource from '../asset/image/project.jpg'
import stageImageTools from '../asset/image/tools.jpg'
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
        bgImage={stageImageOpensource}
      >
        <MyProject/>
      </Stage>
      <Stage
        direction="left"
        title="工具"
        primaryColor={STAGE_COLOR_2}
        bgImage={stageImageTools}
      >
        <MyTools/>
      </Stage>
      <Stage
        direction="right"
        title="娱乐"
        primaryColor={STAGE_COLOR_3}
        bgImage={stageImageDota2}
      >
        <MyGame/>
      </Stage>
      <Stage
        direction="left"
        title="我"
        primaryColor={STAGE_COLOR_4}
        bgImage={stageImageMine}
      >
        <AboutMe/>
      </Stage>
      <Footer/>
    </React.Fragment>
  )
}
