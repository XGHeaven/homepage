import * as React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import ArrowLever from "../../../component/common/ArrowLever";
import { rgb } from "color";
import { pinTopTimeout } from "../../../lib/pin-top";
import { resetGlobalState } from "mobx/dist/internal";

export type Direction = "left" | "right";

function revertDirection(direction: Direction) {
  return direction === "left" ? "right" : "left";
}

const CONTENT_HEIGHT = "640px";

const StageContainer = styled.div<{ direction: Direction }>``;

const StageClampContainer = styled.div`
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  backdrop-filter: blur(10px);
`;

const StageHeader = styled.div<{ direction: Direction }>`
  height: 25vh;
  display: flex;
  min-height: 200px;
  flex-direction: ${({ direction }) =>
    direction === "right" ? "row" : "row-reverse"};
  align-items: center;
  justify-content: space-between;
  text-align: ${({ direction }) => revertDirection(direction)};
  position: relative;
`;

const StageContent = styled.div`
  transition: all 1s ease-in-out;
  overflow: hidden;
`;

const InnerContent = styled.div`
  margin: auto;
  height: 100%;
  width: 80%;
  overflow: auto;
  padding: 40px;
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ViewportContent = styled.div`
  height: ${CONTENT_HEIGHT};
  perspective: 800px;
  transform-style: preserve-3d;
  perspective-origin: top;
`;

const StageArrow = styled.div`
  flex: none;
  width: 50%;
  min-width: 160px;
  max-width: 320px;
  text-align: center;
`;

const StageTitle = styled.div`
  flex: none;
  text-align: center;
  min-width: 160px;
  max-width: 320px;
  width: 50%;
  font-size: 56px;
  position: relative;
`;

const enteredStyle = css`
  height: ${CONTENT_HEIGHT};
`;

const exitedStyle = css`
  height: 0;
`;

const innerEnteredStyle = css`
  transform: rotateX(0);
`;

const innerExitedStyle = css`
  transform: rotateX(-90deg);
`;

export default class Stage extends React.Component<{
  direction: Direction;
  title: string;
  primaryColor: string;
  bgImage?: string;
}> {
  render() {
    const { direction, title, primaryColor = "white", bgImage } = this.props;
    const isDark = rgb(primaryColor).isDark();
    const contentColor = (isDark
      ? rgb(primaryColor).lighten(0.2)
      : rgb(primaryColor).darken(0.2)
    ).toString();
    const contentBackgroundColor = !isDark
      ? "rgba(255,255,255,.7)"
      : "rgba(24,24,24,.7)";
    const contentTextColor = rgb(contentColor).isDark() ? "white" : "black";
    const titleColor = rgb(primaryColor).isLight() ? "white" : "black";
    return (
      <StageContainer
        css={css`
          background: url(${bgImage}) left/cover no-repeat;
          /*box-shadow: inset 0 -80px 40px -40px white,
          inset 0 80px 40px -40px white;*/
        `}
        direction={direction}
      >
        <StageClampContainer>
          <StageHeader
            direction={direction}
            style={{
              // backgroundColor: primaryColor,
              color: rgb(primaryColor).isLight() ? "black" : "white",
            }}
          >
            <StageTitle
              css={css`
            padding-${direction}: 0;
            text-shadow: 0 0 5px ${titleColor}, 1px 1px 0 ${titleColor}, -1px 1px 0 ${titleColor}, 1px -1px 0 ${titleColor}, -1px -1px 0 ${titleColor};
          `}
            >
              {title}
            </StageTitle>
            <StageArrow>
              <ArrowLever isDark={!isDark} direction={"bottom"} />
            </StageArrow>
          </StageHeader>
          <StageContent
          // style={{ background: primaryColor }}
          >
            <ViewportContent>
              <InnerContent
                style={{
                  background: contentBackgroundColor,
                  color: contentTextColor,
                }}
              >
                {this.props.children}
              </InnerContent>
            </ViewportContent>
          </StageContent>
        </StageClampContainer>
      </StageContainer>
    );
  }
}
