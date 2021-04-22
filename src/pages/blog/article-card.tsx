import React from "react";
import { SimplifyArticle } from "../../types";
import styled from "@emotion/styled";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const Container = styled.div`
  margin-top: 16px;
  margin-bottom: 24px;
  display: inline-block;
`;

const DateTime = styled.div`
  color: #9eabb3;
  font-size: 14px;
  margin-bottom: 24px;
`;

const ArticleTitle = styled(Link)`
  display: block;
  color: #4a4a4a;
  font-size: 28px;
  line-height: 40px;
  font-weight: bold;
  text-decoration: none;
`;

const ArticleDescription = styled.div`
  line-height: 30px;
  color: #5d686f;
`;

export function ArticleCard({ article }: { article: SimplifyArticle }) {
  console.log(article);
  return (
    <Container>
      <ArticleTitle to={`/blog/article/${article.slug}`}>
        {article.title}
      </ArticleTitle>
      <DateTime>{format(article.createTime, "yyyy.MM.dd")}</DateTime>
      <ArticleDescription>{article.description}</ArticleDescription>
    </Container>
  );
}
