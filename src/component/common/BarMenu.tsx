import * as React from 'react'
import { css } from "emotion";
import { PRIMARY_COLOR } from "../../style/variable";
import styled from "react-emotion";
import { rgb } from 'color';

function transparentColor(color: string) {
  return rgb(color).alpha(0).toString()
}

const barColor = '#0C0E1D'
const hoverColor = '#333754'
const barTransColor = transparentColor(barColor)
const hoverTransColor = transparentColor(hoverColor)

const barMenuStyle = css`
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  color: lightgray;
  background: linear-gradient(to left, ${barTransColor}, ${barColor});
  position: relative;
  cursor: pointer;
  transition: all .3s;

  &:hover {
    background: linear-gradient(to left, ${hoverTransColor}, ${hoverColor});
  }

  @media (max-width: 576px) {
    background: linear-gradient(to top, ${barTransColor}, ${barColor});

    &:hover {
      background: linear-gradient(to top, ${hoverTransColor}, ${hoverColor});
    }
  }
`

const InnerWrap = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  margin: auto;
  text-align: center;
  height: 32px;
  line-height: 32px;
`

export default function BarMenu(props) {
  const {href, children} = props
  const inner = <InnerWrap>{children}</InnerWrap>

  if (href) {
    return (<a href={href} className={barMenuStyle} target="_blank">{inner}</a>)
  } else {
    return (<div className={barMenuStyle}>{inner}</div>)
  }
}
