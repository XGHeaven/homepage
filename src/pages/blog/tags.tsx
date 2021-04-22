import React, { useMemo, useState } from "react";
import { useSource } from "../../react";
import { tagsSource } from "../../sources";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { ArticleGroup } from "./article-group";
import { FilterInput } from "./filter-input";
import { ContentContainer } from "./layout";
import { Loading } from "../../component/loading";

const Tags = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 16px;
`;

const Tag = styled(Link)`
  border: 1px solid #0c78ce;
  line-height: 32px;
  padding: 0 10px;
  margin-right: 8px;
  margin-bottom: 8px;
  background-color: white;
  border-radius: 4px;
`;

export function TagsPage() {
  const [tags, loading, error] = useSource(tagsSource, null);
  const [filter, setFilter] = useState("");
  const filteredTags = useMemo(
    () =>
      tags
        ? tags.filter((tag) =>
            tag.name.toLowerCase().includes(filter.toLowerCase())
          )
        : [],
    [tags, filter]
  );
  return (
    <ContentContainer>
      <Loading loading={loading} error={error}>
        <FilterInput
          placeholder="搜索标签"
          onChange={(e) => setFilter(e.target.value)}
        />
        <Tags>
          {filteredTags.map((tag) => (
            <Tag to={`#${tag.name}`}>{tag.name}</Tag>
          ))}
        </Tags>
        <div>
          {filteredTags.map((tag) => (
            <ArticleGroup name={tag.name} articles={tag.articles} />
          ))}
        </div>
      </Loading>
    </ContentContainer>
  );
}
