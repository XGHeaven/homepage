import React from "react";
import { useParams } from "react-router";
import { articleDetailSource } from "../../sources";
import { useSource } from "../../react";
import styled from "@emotion/styled";
import { format } from "date-fns";
import { css, jsx } from "@emotion/react";
import { ContentContainer } from "./layout";
import { MarkdownRender } from "./markdown-render";
import { TimeDisplay } from "./time-display";
import { TOCRender } from "./toc-render";
import { Loading } from "../../component/loading";

const ArticleTitle = styled.h1`
  font-size: 36px;
  margin: 0;
  color: #4a4a4a;
`;

const ArticleContent = styled.div`
  margin-top: 20px;
  color: #5d686f;
`;

export function ArticlePage() {
  const { slot } = useParams<{ slot: string }>();
  const [article, loading, error] = useSource(articleDetailSource, slot);

  return (
    <ContentContainer
      css={css`
        padding-top: 24px;
      `}
    >
      <Loading loading={loading} error={error}>
        {article && (
          <div>
            <ArticleTitle>{article!.title}</ArticleTitle>
            <div>
              <TimeDisplay time={article!.createTime}></TimeDisplay>
            </div>
            {article!.toc && (
              <div>
                <TOCRender toc={article!.toc} />
              </div>
            )}
            <ArticleContent className="markdown-body">
              <MarkdownRender node={article?.nodes} />
            </ArticleContent>
          </div>
        )}
      </Loading>
    </ContentContainer>
  );
}
