import * as React from "react";
import { useSource } from "../../../react";
import { recentArticlesSource } from "../../../sources";
import { ArticleCard } from "../../blog/article-card";

export default function ArticlesStage(props) {
  const [articles, loading, error] = useSource(recentArticlesSource, null)
  return <div>
    {articles?.map(art => (
      <ArticleCard article={art}/>
    ))}
  </div>;
}
