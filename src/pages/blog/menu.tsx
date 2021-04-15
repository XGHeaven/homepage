import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import { FC } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../../icon";

const S_Link = css`
  display: inline-block;
  width: 100%;
  height: 44px;
  line-height: 44px;
  color: white;
  text-decoration: none;
  padding: 0 24px;
  transition: all 0.3s ease;
  &:hover, &:active {
    color: white;
    background-color: rgba(100, 100, 100, .3);
  }
`

const IconPart = styled.div`
  display: inline-block;
  font-size: 20px;
  margin-right: 16px;
  width: 32px;
  text-align: center;
`

export const Menu: FC<{to: string, icon: string}> = props => {
  return <Link to={props.to} css={S_Link}>
    <IconPart>
    <Icon type={props.icon}/>
    </IconPart>
    {props.children}
    </Link>
}
