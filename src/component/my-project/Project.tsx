import * as React from 'react'
import styled, { keyframes } from 'react-emotion';

const LinkContainer = styled.a`
  display: block;
  text-decoration: none;
  color: inherit;
  margin-bottom: 18px;
`

const ProjectContainer = styled.div`
  text-align: center;
  padding: 36px 0 24px 0;
  box-shadow: 0 0 2px rgba(255, 255, 255, .3);
  transition: all 0.3s ease-in-out;
  border-radius: 12px;
  position: relative;

  &:hover {
    box-shadow: 0 0 6px rgba(255, 255, 255, .6);

    &::before {
      border-top-color: white;
    }
  }

  &::before {
    content: '';
    position: absolute;
    transition: all .3s;
    top: 18px;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 0;
    height: 0;
    border: 6px solid rgba(255, 255, 255, .5);
    border-bottom: 0;
    border-left-color: transparent;
    border-right-color: transparent;
  }
`

const ProjectTitle = styled.div`
  font-size: 24px;
`

const ProjectDescription = styled.div`
`

export default function Project(props: {
  title: string,
  img?: string,
  href?: string,
  children?: React.ReactNode
}) {
  const { title, children, href } = props

  return (
    <LinkContainer href={href || 'javascript:void 0;'} rel="noopener" target="_blank">
      <ProjectContainer>
        <ProjectTitle>{title}</ProjectTitle>
        <ProjectDescription>{children}</ProjectDescription>
      </ProjectContainer>
    </LinkContainer>
  )
}
