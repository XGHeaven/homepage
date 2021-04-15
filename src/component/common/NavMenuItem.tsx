import * as React from "react";
import { css } from "@emotion/react";
import { rgb } from "color";
import { Link, LinkProps } from "react-router-dom";

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

export default function BarMenu(
  props: LinkProps
) {
  const { to, children, ...otherProps } = props;
  const inner = children;

  if (to) {
    return (
      <Link to={to} css={barMenuStyle} {...otherProps}>
        {inner}
      </Link>
    );
  } else {
    return (
      <div css={barMenuStyle} {...(otherProps as any)}>
        {inner}
      </div>
    );
  }
}
