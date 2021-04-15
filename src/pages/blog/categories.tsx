import React, { useMemo, useState } from 'react'
import { useSource } from '../../react'
import { categoriesSource } from '../../sources'
import { lightFormat } from 'date-fns'
import { ContentContainer } from './layout'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { LinkButton } from './button'
import { ArticleGroup } from './article-group'
import { FilterInput } from './filter-input'
import { Loading } from '../../component/loading'

const CateList = styled.ul`
  list-style: none;
  padding: 0;
  line-height: 32px;
  margin-top: 16px;
`

const CateListItem = styled.li`

`

const CateListItemLink = styled.a`
`

const CateArticles = styled.div``

export function CategoriesPage() {
  const [cats, loading, error] = useSource(categoriesSource, null)
  const [filter, setFilter] = useState('')
  const filteredCate = useMemo(() => cats ? cats.filter(cat => cat.name.toLowerCase().includes(filter.toLowerCase())) : [], [cats, filter])

  return (
    <ContentContainer>
      <Loading loading={loading} error={error}>
      <FilterInput placeholder="搜索分类" onChange={e => setFilter(e.target.value)}/>
      <CateList>
        {filteredCate?.map(cat => (<CateListItem>
          <LinkButton to={`#${cat.name}`}>{cat.name}</LinkButton>
        </CateListItem>

        ))}
      </CateList>
      <CateArticles>
        {filteredCate?.map(cat => <ArticleGroup name={cat.name} articles={cat.articles}/>)}
      </CateArticles>
      </Loading>
    </ContentContainer>
  )
}
