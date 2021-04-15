import React from 'react'
import { HeadChildren } from "../core";
import Helmet from 'react-helmet'

export function SaniHead(props: {config: HeadChildren}) {
  const { title, description } = props.config
  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description}/>}
      {/* TODO: add more */}
    </Helmet>
  )
}
