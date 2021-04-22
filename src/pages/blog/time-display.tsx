import styled from "@emotion/styled";
import { css, jsx } from "@emotion/react";
import React from "react";
import { format } from "date-fns";

const timeStyle = css`
  color: #9eabb3;
  font-size: 12px;
`;

export function TimeDisplay(props: { time: number | Date }) {
  return <span css={timeStyle}>{format(props.time, "yyyy.MM.dd")}</span>;
}
