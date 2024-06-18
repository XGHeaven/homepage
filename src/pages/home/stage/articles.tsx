import * as React from "react";
import { useSource } from "../../../react";
import { recentArticlesSource } from "../../../sources";
import { ArticleCard } from "../../blog/article-card";

export default function ArticlesStage() {
  const [articles, loading, error] = useSource(recentArticlesSource, null);
  return (
    <div className="px-4">
      {articles?.map((art) => (
        <ArticleCard article={art} />
      ))}
    </div>
  );
}
