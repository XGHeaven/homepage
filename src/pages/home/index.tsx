import * as React from "react";
import FirstPage from "../../component/first-page/FirstPage";
import { Stage } from "./stage/Stage";
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

const stages: [title: string, child: React.ReactNode, moreLink?: string][] = [
  ["Open Source Projects", <MyProject />, "https://github.com/XGHeaven"],
  ["Articles", <ArticlesStage />, "/blog"],
];

export function HomePage() {
  return (
    <React.Fragment>
      <FirstPage />
      {stages.map(([title, child, moreLink], i) => (
        <Stage title={title} index={i} moreLink={moreLink}>
          {child}
        </Stage>
      ))}
      {/* <Stage
        direction="right"
        title="娱乐"
        primaryColor={STAGE_COLOR_3}
        bgImage={Stage3}
      >
        <MyGame />
      </Stage> */}
      {/* <Stage
        direction="left"
        title="我"
        primaryColor={STAGE_COLOR_4}
        bgImage={Stage4}
      >
        <AboutMe />
      </Stage> */}
      <Footer />
    </React.Fragment>
  );
}
