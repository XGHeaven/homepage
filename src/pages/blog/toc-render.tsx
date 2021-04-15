import React, { FC } from "react";
import { MarkdownRender } from "./markdown-render";

const renderTOCToReactNode = (node: any) => {

}

export const TOCRender: FC<{toc: any}> = (props) => {
  return <MarkdownRender node={props.toc} isTOC={true}/>
}
