import React from "react";
import { recentArticlesSource } from "../../sources";
import { useSource } from "../../react";
import { ArticleCard } from "./article-card";
import { ContentContainer } from "./layout";
import { Loading } from "../../component/loading";

export function HomePage() {
  const [articles, loading, error] = useSource(recentArticlesSource, null)

  return (
    <ContentContainer>
      <Loading loading={loading} error={error}>
        {articles?.map(article => <ArticleCard article={article}></ArticleCard>)}
      </Loading>
    </ContentContainer>
  )
}
