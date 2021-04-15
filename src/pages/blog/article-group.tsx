import styled from "@emotion/styled";
import React, { FC } from "react";
import { LinkButton } from "./button";

const ArticleGroupContainer = styled.div`
  margin-top: 20px;
`

const ArticleGroupTitle = styled.div`
  color: #5d686f;
  margin-top: 8px;
  margin-bottom: 4px;
  font-weight: bold;
  font-size: 18px;
`


const ArticleItemList = styled.ul``
const ArticleItem = styled.li`
  line-height: 32px;
`

export const ArticleGroup: FC<{
  articles: any[],
  name: string
}> = (props) => {
  return (
    <ArticleGroupContainer>
    <ArticleGroupTitle>
      {props.name}({props.articles.length})
    </ArticleGroupTitle>
    <ArticleItemList>
      {props.articles.map(art => (
        <ArticleItem><LinkButton type="none" to={`/article/${art.slug}`}>{art.title}</LinkButton></ArticleItem>
      ))}
    </ArticleItemList>
    </ArticleGroupContainer>
  )
}
