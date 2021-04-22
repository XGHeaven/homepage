import React, { Fragment } from "react";
import { articlePage } from "../../sources";
import { useSource } from "../../react";
import { ArticleCard } from "./article-card";
import { ContentContainer } from "./layout";
import { Loading } from "../../component/loading";
import styled from "@emotion/styled";
import { LinkButton } from "./button";
import { useLocation } from "react-router";

const BottomPagination = styled.div`
  text-align: center;
  color: #5d686f;
`;

const PaginationButton = styled(LinkButton)`
  margin: 0 8px;
`;

export function ArticlesPage() {
  // const [articles, loading, error] = useSource(recentArticlesSource, null)
  const { search } = useLocation<{ page?: string }>();
  const parsed = new URLSearchParams(search);
  const page = parseInt(parsed.get("page") || "1", 10) || 1;
  const [pagination, loading, error] = useSource(articlePage, {
    page: page,
    pageSize: 10,
  });

  return (
    <ContentContainer>
      <Loading loading={loading} error={error}>
        {pagination && (
          <Fragment>
            <div>
              {pagination.nodes.map((article) => (
                <ArticleCard article={article} />
              ))}
            </div>
            <BottomPagination>
              <PaginationButton
                to={`./?page=${page - 1}`}
                style={{ visibility: page === 1 ? "hidden" : "visible" }}
              >
                Prev
              </PaginationButton>
              {page} / {Math.ceil(pagination.totalCount / 10)}
              <PaginationButton
                to={`./?page=${page + 1}`}
                style={{
                  visibility: !pagination.hasNextPage ? "hidden" : "visible",
                }}
              >
                Next
              </PaginationButton>
            </BottomPagination>
          </Fragment>
        )}
      </Loading>
    </ContentContainer>
  );
}
