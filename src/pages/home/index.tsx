import * as React from "react";
import FirstPage from "../../component/first-page/FirstPage";
import Stage from "./stage/Stage";
import Footer from "../../component/footer/Footer";
import {
  STAGE_COLOR_1,
  STAGE_COLOR_2,
  STAGE_COLOR_3,
  STAGE_COLOR_4,
} from "../../style/variable";
import AboutMe from "./stage/AboutMe";
import MyProject from "./stage/MyProject";
import MyGame from "./stage/MyGame";
import ArticlesStage from "./stage/articles";

import Stage1 from "../../asset/image/project.jpg";
import Stage2 from "../../asset/image/tools.jpg";
import Stage3 from "../../asset/image/dota2.jpg";
import Stage4 from "../../asset/image/mine.jpg";

export function HomePage() {
  return (
    <React.Fragment>
      <FirstPage />
      <Stage
        direction="right"
        title="开源"
        primaryColor={STAGE_COLOR_1}
        bgImage={Stage1}
      >
        <MyProject />
      </Stage>
      <Stage
        direction="left"
        title="文章"
        primaryColor={STAGE_COLOR_2}
        bgImage={Stage2}
      >
        <ArticlesStage />
      </Stage>
      <Stage
        direction="right"
        title="娱乐"
        primaryColor={STAGE_COLOR_3}
        bgImage={Stage3}
      >
        <MyGame />
      </Stage>
      <Stage
        direction="left"
        title="我"
        primaryColor={STAGE_COLOR_4}
        bgImage={Stage4}
      >
        <AboutMe />
      </Stage>
      <Footer />
    </React.Fragment>
  );
}
