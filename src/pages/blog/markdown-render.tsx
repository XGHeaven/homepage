import React, { Fragment, memo, ReactNode } from "react";
import { Prism, PrismAsync } from "react-syntax-highlighter";
import type { Content } from "mdast";

import codeStyle from "react-syntax-highlighter/dist/esm/styles/prism";

const assetHost =
  process.env.NODE_ENV !== "production" ? "http://localhost:3000" : "";

export function assetURL(url: string) {
  if (url.startsWith("http")) {
    return url;
  }

  if (url.startsWith("asset://")) {
    return `${assetHost}/assets${url.slice(8)}`;
  }

  if (url.startsWith("/")) {
    url = url.slice(1);
  }

  return assetHost.endsWith("/") ? `${assetHost}${url}` : `${assetHost}/${url}`;
}

function transformToReactNode(
  node: Content | Content[],
  isTOC: boolean
): ReactNode {
  if (Array.isArray(node)) {
    return node.map((node) => transformToReactNode(node, isTOC));
  }

  switch (node.type) {
    case "heading": {
      const tagName = `h${node.depth ?? 1}`;
      return React.createElement(
        tagName,
        { id: node?.data?.id },
        transformToReactNode(node.children, isTOC)
      );
    }
    case "text": {
      return node.value;
    }

    case "paragraph": {
      return <p>{transformToReactNode(node.children, isTOC)}</p>;
    }

    case "list": {
      const listTag = node.ordered ? "ol" : "ul";
      return React.createElement(
        listTag,
        {},
        transformToReactNode(node.children, isTOC)
      );
    }

    case "listItem": {
      // TODO: checked
      return <li>{transformToReactNode(node.children, isTOC)}</li>;
    }

    case "strong": {
      return <strong>{transformToReactNode(node.children, isTOC)}</strong>;
    }

    case "inlineCode": {
      return <code>{node.value}</code>;
    }

    case "code": {
      console.log(node.lang);
      // return (
      //   <PrismAsync language={node.lang} style={codeStyle}>
      //     {node.value}
      //   </PrismAsync>
      // )
      return <pre>{node.value}</pre>;
    }

    case "link": {
      const child = transformToReactNode(node.children, isTOC);
      if (isTOC) {
        return (
          <a href={node.url} target="_self">
            {child}
          </a>
        );
      }
      return (
        <a href={node.url} target="_blank">
          {child}
        </a>
      );
    }

    case "image": {
      return <img src={assetURL(node.url)} title={node.title} />;
    }

    case "blockquote": {
      return (
        <blockquote>{transformToReactNode(node.children, isTOC)}</blockquote>
      );
    }

    default: {
      console.warn(`Unsupport type(${node.type})`, node);
      return <span>Unsupport type({node.type})</span>;
    }
  }
}

export const MarkdownRender = memo(function MarkdownRender(props: {
  node: any;
  isTOC?: boolean;
}) {
  return (
    <Fragment>
      {transformToReactNode(props.node, props.isTOC ?? false)}
    </Fragment>
  );
});
