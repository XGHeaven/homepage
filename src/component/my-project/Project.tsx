import * as React from "react";
import styled from "@emotion/styled";

const LinkContainer = styled.a`
  display: block;
  text-decoration: none;
  color: inherit;
`;

const ProjectContainer = styled.div`
  text-align: center;
  position: relative;

  &:hover::before {
    top: 8px;
  }

  &::before {
    content: "";
    position: absolute;
    transition: all 0.3s;
    top: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 0;
    height: 0;
    border: 6px solid rgba(0, 0, 0, 0.5);
    border-bottom: 0;
    border-left-color: transparent;
    border-right-color: transparent;
  }
`;

export default function Project(props: {
  title: string;
  img?: string;
  href?: string;
  children?: React.ReactNode;
}) {
  const { title, children, href } = props;

  return (
    <LinkContainer
      href={href || "javascript:void 0;"}
      rel="noopener"
      target="_blank"
    >
      <ProjectContainer className="w-full h-full p-4">
        <div className="text-3xl mb-4 font-bold text-gray-600 hover:text-gray-800 transition-colors">
          {title}
        </div>
        <div className="text-gray-500">{children}</div>
      </ProjectContainer>
    </LinkContainer>
  );
}
