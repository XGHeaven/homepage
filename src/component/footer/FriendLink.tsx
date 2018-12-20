import * as React from 'react'
import styled from 'react-emotion';

const Link = styled.a`
  text-decoration: none;
`

export default function FriendLink(props: {
  name: string,
  author: string,
  link?: string,
  desc?: string
}) {
  return (
    <li>
      <div>
        {props.link ? <Link href={props.link} target="_blank">{props.name}</Link> : props.name} (@{props.author})
      </div>
      {props.desc && <div>{props.desc}</div>}
    </li>
  )
}
