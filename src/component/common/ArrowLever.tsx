import * as React from "react";
import { css, keyframes } from "@emotion/react";
import styled from "@emotion/styled";

export type ArrowDirection = "top" | "bottom" | "left" | "right";

const ArrowHost = styled.div`
  display: inline-block;
  width: 160px;
  height: 160px;
  position: relative;
  transition: all 1s;
  opacity: 0.3;
`;

const arrowUnitKeyframe = keyframes`
  from, to {
    transform: rotate(45deg)
  }

  25%, 75% {
    transform: rotate(0)
  }
`;

const ArrowBase = css`
  position: absolute;
  width: 15%;
  height: 50%;
  border-radius: 200px;
  top: 0;
  bottom: 0;
  margin: auto;
  background: white;
  transform-origin: center;
  border-width: 1px;
  border-style: solid;
`;

const ArrowLeft = styled.div`
  ${ArrowBase}
  left: 28%;
  transform: rotate(45deg);
`;

const ArrowRight = styled.div`
  ${ArrowBase}
  right: 28%;
  transform: rotate(-45deg);
`;

const rotate = {
  top: 0,
  left: 270,
  right: 90,
  bottom: 180,
};

const rotateStyle = {
  top: css`
    transform: rotate(0);
  `,
  left: css`
    transform: rotate(270deg);
  `,
  right: css`
    transform: rotate(90deg);
  `,
  bottom: css`
    transform: rotate(180deg);
  `,
};

function calcRotate(preDir: ArrowDirection, curDir: ArrowDirection) {
  return rotate[preDir] + Math.abs(rotate[curDir] - rotate[preDir]);
}

export default class ArrowLever extends React.Component<{
  direction: ArrowDirection;
  isDark: boolean;
}> {
  deg = 0;
  preDir: ArrowDirection = "top";

  componentDidUpdate(prevProps) {
    this.preDir = prevProps.direction;
  }

  render() {
    const { direction, isDark } = this.props;
    const startDeg = rotate[this.preDir];
    const endDeg =
      rotate[this.preDir] + Math.abs(rotate[direction] - rotate[this.preDir]);
    const commonStyle = css`
      background: ${isDark ? "black" : "white"};
      border-color: ${isDark ? "white" : "black"};
      box-shadow: 0 0 10px 0 ${isDark ? "white" : "black"};
    `;
    return (
      <ArrowHost
        css={[
          rotateStyle[direction],
          css`
            transform: rotate(${endDeg}deg);
          `,
        ]}
      >
        <ArrowLeft css={commonStyle} />
        <ArrowRight css={commonStyle} />
      </ArrowHost>
    );
  }
}
