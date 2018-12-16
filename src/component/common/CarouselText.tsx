import * as React from "react";
import { observer } from 'mobx-react'
import { observable, action, computed } from 'mobx'
import styled, { keyframes, css, cx } from "react-emotion";
import { PRIMARY_COLOR, SECONAD_COLOR } from "../../style/variable";

const TYPE_INTERVAL = 80
const WATI_INTERVAL = 2000

const cursorBlinkKeyframes = keyframes`
  from, to {
    border-right-color: gray;
  }

  25%, 75% {
    border-right-color: transparent;
  }
`

const textAddedKeyframes = keyframes`
  from, to {
    /* font-size: 1em; */
    transform: translateY(0) scaleY(1);
    color: inherit;
  }

  50% {
    /* font-size: 1.5em; */
    transform: translateY(-4px) scaleY(1.4);
    color: gray;
  }
`

const TypeArea = styled.pre`
  border-right: 2px solid gray;
  padding-left: 0.5em;
  padding-right: 4px;
  display: inline;
  white-space: normal;
  word-break: break-word;
`

const SingleText = styled.pre`
  display: inline-block;
  animation: ${textAddedKeyframes} .5s ease-in-out 1;
`

const Cursor = styled.span`
  height: 1em;
  width: 2px;
  display: inline-block;
  background: gray;
`

const cursorBlinkStyle = css`
  animation: ${cursorBlinkKeyframes} 1s step-end infinite;
`

@observer
export default class CarouselText extends React.Component {
  texts: string[] = ['Frontend Developer', 'Minecrafter', 'Backend Noder', 'Game Lover']
  @observable current: number = 0;
  @observable index: number = this.texts[this.current].length;
  @observable increase = false;

  @computed get currentText(): string {
    return this.texts[this.current].slice(0, this.index)
  }

  @computed get prevText(): string {
    return this.currentText.slice(0, -1)
  }

  @computed get currentChar(): string {
    return this.currentText.slice(-1)
  }

  @computed get shouldBlink(): boolean {
    return !this.increase && this.texts[this.current].length === this.index
  }

  @action.bound doInterval() {
    const text = this.texts[this.current]
    if (this.increase) {
      if (this.index < text.length) {
        this.index++
        this.next(TYPE_INTERVAL)
      } else {
        this.increase = false
        this.next(WATI_INTERVAL)
      }
    } else {
      if (this.index === 0) {
        this.current = (this.current + 1) % this.texts.length
        this.increase = true
      } else {
        this.index--
      }
      this.next(TYPE_INTERVAL)
    }
  }

  next(timer: number) {
    setTimeout(this.doInterval, timer)
  }

  componentDidMount() {
    this.next(WATI_INTERVAL)
  }

  render() {
    return (
      <TypeArea className={cx({[cursorBlinkStyle]: this.shouldBlink})}>
        {
          this.currentText.split('').map((char, index) => (
            <SingleText key={`${char}${index}`}>{char}</SingleText>
          ))
        }
      </TypeArea>
    )
  }
}
