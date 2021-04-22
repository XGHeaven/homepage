import { Link, LinkProps } from "react-router-dom";
import { css } from "@emotion/react";
import { CLink, CLinkHover, CLinkVisited } from "../../style/color";

export function Button() {}

export interface LinkButtonProps extends LinkProps {
  type?: "none" | "default";
}

export const linkButtonStyle = css`
  padding: 4px 6px;
  transition: all 0.3s ease;
  border-radius: 4px;
`;

export const linkStyleThemes = {
  none: css`
    color: #5d686f;
    &:hover,
    &:active {
      color: #506060;
      background-color: rgba(20, 20, 20, 0.2);
    }
    &:visited {
      color: #495959;
    }
  `,
  default: css`
    color: ${CLink};
    &:hover,
    &:active {
      color: ${CLinkHover};
      background-color: rgba(20, 20, 40, 0.2);
    }
    &:visited {
      color: ${CLinkVisited};
    }
  `,
};

export function LinkButton({ type, ...props }: LinkButtonProps) {
  return (
    <Link
      {...props}
      css={[linkButtonStyle, linkStyleThemes[type ?? "default"]]}
    />
  );
}
