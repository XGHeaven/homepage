import * as React from "react";
import styled, { css, cx } from "react-emotion";
import ArrowLever from "../common/ArrowLever";
import Transition from "react-transition-group/Transition";
import { rgb } from 'color'
import { pinTopTimeout } from "../../lib/pin-top";

export type Direction = 'left' | 'right'

function revertDirection(direction: Direction) {
  return direction === 'left' ? 'right' : 'left'
}

const CONTENT_HEIGHT = '75vh'

const StageContainer = styled.div<{direction: Direction}>`
`

const StageHeader = styled.div<{direction: Direction}>`
  height: 25vh;
  display: flex;
  min-height: 200px;
  flex-direction: ${({direction}) => direction === 'right' ? 'row' : 'row-reverse'};
  align-items: center;
  justify-content: space-between;
  text-align: ${({direction}) => revertDirection(direction)};
  position: relative;

  &:before {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    pointer-events: none;
    opacity: 1;
  }
`

const StageContent = styled.div`
  transition: all 1s ease-in-out;
  overflow: hidden;
`

const InnerContent = styled.div`
  margin: auto;
  height: 100%;
  width: 80%;
  overflow: auto;
  transform-origin: top;
  transition: all 1s ease-in-out;
  box-shadow: inset 0 0 8px 0 rgba(255, 255, 255, 0.3);
  border-top-right-radius: 24px;
  border-top-left-radius: 24px;
  padding: 40px;
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
    border-radius: 0;
  }
`

const ViewportContent = styled.div`
  height: ${CONTENT_HEIGHT};
  perspective: 800px;
  transform-style: preserve-3d;
  perspective-origin: top;
`

const StageArrow = styled.div`
  flex: none;
  width: 40%;
  min-width: 160px;
  max-width: 320px;
  text-align: center;
`

const StageTitle = styled.div`
  flex: none;
  text-align: center;
  min-width: 160px;
  max-width: 320px;
  width: 60%;
  font-size: 56px;
  position: relative;
`

const enteredStyle = css`
  height: ${CONTENT_HEIGHT};
`

const exitedStyle = css`
  height: 0;
`

const innerEnteredStyle = css`
  transform: rotateX(0);
`

const innerExitedStyle = css`
  transform: rotateX(-90deg);
`

export default class Stage extends React.Component<{
  direction: Direction
  title: string
  primaryColor: string
  bgImage?: string
}, {
  open: boolean
}> {
  state = {
    open: false
  }

  innerContentRef = React.createRef<HTMLDivElement>()
  $host?: HTMLElement

  toggle = () => {
    this.setState({open: !this.state.open}, () => {
      if (this.state.open && this.$host) {
        pinTopTimeout(this.$host, 1000, document.documentElement)
      }
    })
  }

  render() {
    const { direction, title, primaryColor = 'white', bgImage } = this.props
    const { open } = this.state
    const isDark = rgb(primaryColor).isDark()
    const contentColor = (isDark ? rgb(primaryColor).lighten(0.2) : rgb(primaryColor).darken(0.2)).toString()
    const contentTextColor = rgb(contentColor).isDark() ? 'white' : 'black'
    const titleColor = rgb(primaryColor).isLight() ? 'white' : 'black'
    return (
    <StageContainer direction={direction} innerRef={dom => this.$host = dom}>
        <StageHeader direction={direction} onClick={this.toggle} className={css`
          &:before {
            background: url(${bgImage}) left/cover no-repeat;
            box-shadow: inset 0 -80px 40px -60px ${primaryColor}, inset 0 80px 40px -60px ${primaryColor};
          }
        `} style={{
          backgroundColor: primaryColor,
          color: rgb(primaryColor).isLight() ? 'black' : 'white'
        }}>
          <StageTitle className={css`
            padding-${direction}: 0;
            text-shadow: 0 0 5px ${titleColor}, 1px 1px 0 ${titleColor}, -1px 1px 0 ${titleColor}, 1px -1px 0 ${titleColor}, -1px -1px 0 ${titleColor};
          `}>
            {title}
          </StageTitle>
          <StageArrow>
            <ArrowLever
              isDark={!isDark}
              direction={ open ? 'bottom' : direction}
            />
          </StageArrow>
        </StageHeader>
        <Transition timeout={1000} in={this.state.open}>
          {
            state => (
              <StageContent className={cx({
                [enteredStyle]: state === 'entered' || state === 'entering',
                [exitedStyle]: state === 'exited' || state === 'exiting',
              })} style={{background: primaryColor}}>
                <ViewportContent>
                  <InnerContent
                    className={cx({
                      [innerEnteredStyle]: state === 'entered' || state === 'entering',
                      [innerExitedStyle]: state === 'exited' || state === 'exiting'
                    })}
                    style={{
                      background: contentColor,
                      color: contentTextColor
                    }}
                  >
                    {this.props.children}
                  </InnerContent>
                </ViewportContent>
              </StageContent>
            )
          }
        </Transition>
      </StageContainer>
    )
  }
}