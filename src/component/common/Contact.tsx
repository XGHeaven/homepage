import * as React from "react";
import { SECONAD_COLOR } from "../../style/variable";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap.css";
import { css } from "@emotion/react";
import { Icon } from "../../icon";

const baseStyle = css`
  color: ${SECONAD_COLOR};
  display: inline-block;
  font-size: 18px;
  transition: all 0.3s;
  padding: 4px;
  border-radius: 50%;
  border-top-right-radius: 4px;
  border: 1px solid transparent;
  margin: 0 4px;
  line-height: 1;
`;

export default function Contact(props: {
  icon: string;
  primaryColor: string;
  title?: React.ReactNode;
  img?: string;
  link?: string;
}) {
  const icon = (
    <span
      css={[
        baseStyle,
        css`
          &:hover {
            color: ${props.primaryColor};
            background: white;
            transform: scale(1.3) translateY(-5px);
          }
        `,
      ]}
    >
      <Icon type={props.icon} />
    </span>
  );

  const overlay = (
    <div>
      {props.title}
      {props.img && <img src={props.img} />}
    </div>
  );

  return (
    <Tooltip placement="top" overlay={overlay}>
      {props.link ? (
        <a className="inline-block" href={props.link} target="_blank">
          {icon}
        </a>
      ) : (
        icon
      )}
    </Tooltip>
  );
}
