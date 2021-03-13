import * as React from "react";
import { css } from "@emotion/react";
import { rgb } from "color";

function transparentColor(color: string) {
  return rgb(color).alpha(0).toString();
}

const barColor = "#0C0E1D";
const hoverColor = "#333754";
const barTransColor = transparentColor(barColor);
const hoverTransColor = transparentColor(hoverColor);

const barMenuStyle = css`
  color: lightgray;
  cursor: pointer;
  transition: all 0.3s;
  line-height: 48px;
  padding: 0 16px;
`;

export default function BarMenu(props: {href: string, children: any}) {
  const { href, children } = props;
  const inner = children;

  if (href) {
    return (
      <a href={href} css={barMenuStyle} target="_blank">
        {inner}
      </a>
    );
  } else {
    return <div css={barMenuStyle}>{inner}</div>;
  }
}
