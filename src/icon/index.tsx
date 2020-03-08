import React, { HTMLAttributes } from 'react'
import styled from 'react-emotion'

import './iconfont.js'

interface IconProps extends HTMLAttributes<HTMLOrSVGElement> {
  type?: string
}

const IconElement = styled.svg`
  width: 1em; height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
`

export function Icon({type, ...otherProps}: IconProps) {
  return <IconElement {...otherProps}>
    <use xlinkHref={`#xi-${type}`}></use>
  </IconElement>
}
