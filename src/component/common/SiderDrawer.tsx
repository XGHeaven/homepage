import * as React from "react";
import { CSSTransition } from "react-transition-group";
import { css } from "@emotion/react";
import ReactDOM from "react-dom";
import { rgb } from "color";
import { PRIMARY_COLOR, SECONAD_COLOR } from "../../style/variable";
import contains from "../../lib/dom";

const drawerContainerStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  transition: all 0.5s ease-in-out;
`;

const drawerStyle = css`
  position: absolute;
  left: 0;
  width: 400px;
  height: 90%;
  top: 5%;
  overflow-x: hidden;
  overflow-y: auto;
  background: white;
  transition: all 0.5s ease-in-out;
  border-radius: 16px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  padding: 16px 16px;
  box-shadow: 0 0 16px ${rgb(SECONAD_COLOR).alpha(0.5).toString()};

  @media (max-width: 576px) {
    width: 100%;
    height: 95%;
    border-top-left-radius: 16px;
    border-bottom-right-radius: 0;
  }
`;

const enterStyle = css`
  .${drawerStyle} {
    transform: translateX(-100%);
  }
  @media (max-width: 576px) {
    ${drawerStyle} {
      transform: translateY(100%);
    }
  }
  background: rgba(0, 0, 0, 0);
`;

const enterActiveStyle = css`
  .${drawerStyle} {
    transform: translateX(0);
  }
  @media (max-width: 576px) {
    ${drawerStyle} {
      transform: translateY(0);
    }
  }
  background: rgba(0, 0, 0, 0.5);
`;

const exitStyle = css`
  ${enterActiveStyle};
`;

const exitActiveStyle = css`
  ${enterStyle};
`;

export default class SiderDrawer extends React.Component<{
  open: boolean;
  onClose?: () => void;
}> {
  $el: HTMLDivElement;
  drawerRef = React.createRef<HTMLDivElement>();

  constructor(props) {
    super(props);
    const $el = (this.$el = document.createElement("div"));
    $el.style.position = "absolute";
    $el.style.width = "100%";
    $el.style.top = "0";
    document.body.appendChild($el);
  }

  componentWillUnmount() {
    document.body.removeChild(this.$el);
  }

  fireClose = (e: React.MouseEvent<HTMLDivElement>) => {
    const target: HTMLDivElement = e.target as any;
    if (contains(this.drawerRef.current, target)) {
      return;
    }
    this.props.onClose && this.props.onClose();
  };

  updateBodyOverflow() {
    if (this.props.open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }

  renderDrawer() {
    this.updateBodyOverflow();
    return (
      <CSSTransition
        in={this.props.open}
        css={{
          enter: enterStyle,
          enterActive: enterActiveStyle,
          exit: exitStyle,
          exitActive: exitActiveStyle,
        }}
        timeout={500}
        unmountOnExit={true}
      >
        <div className={drawerContainerStyle} onClick={this.fireClose}>
          <div className={drawerStyle} ref={this.drawerRef}>
            {this.props.children}
          </div>
        </div>
      </CSSTransition>
    );
  }

  render() {
    return ReactDOM.createPortal(<div>{this.renderDrawer()}</div>, this.$el);
  }

}
