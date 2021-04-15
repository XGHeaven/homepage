import React, { useMemo } from 'react'
import { useSource } from '../../react'
import { allArticlesSource } from '../../sources'
import { SimplifyArticle } from '../../types'
import styled from '@emotion/styled'
import { setMonth, format } from 'date-fns'
import { LinkButton } from './button'
import { ContentContainer } from './layout'
import { Loading } from '../../component/loading'

type ArchiveArticles = {
  [year: string]: SimplifyArticle[][]
}

const Block = styled.div`
  color: #5d686f;
`

const BlockContent = styled.div`
  padding-left: 40px;
`

const BlockTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin-top: 16px;
  margin-bottom: 8px;
`

const BlockArticles = styled.ul`
  padding: 0;
`

const BlockArticle = styled.li`
  padding: 4px 0;
`

export function ArticlesPage() {
  const [articles, loading, error] = useSource(allArticlesSource, null)
  const sorted = useMemo<ArchiveArticles>(() => {
    if (!articles) {
      return {}
    }

    return articles.reduce<ArchiveArticles>((map, art) => {
      const date = new Date(art.createTime)
      const year = date.getFullYear()
      const month = date.getMonth()

      if (!map[year]) {
        map[year] = new Array(12).fill(0).map(() => [])
      }

      map[year][month].push(art)
      return map
    }, {})
  }, [articles])
  return <ContentContainer>
    <Loading loading={loading} error={error}>
    <div>
        {Object.keys(sorted).sort().reverse().map(year => {
          return (
          <Block>
            <BlockTitle>{year}</BlockTitle>
            <BlockContent>{sorted[year].map((arts, month) => {
              if (arts.length === 0) {
                return null
              }
              return (
                <Block>
                  <BlockTitle>{format(setMonth(new Date(), month), 'MMMM')}</BlockTitle>
                  <BlockContent>
                    <BlockArticles>
                      {arts.map(art => <BlockArticle>
                      <LinkButton type="none" to={`/article/${art.slug}`}>{art.title}</LinkButton>
                      &nbsp;&nbsp;
                      {format(art.createTime, 'MMMM dd')}
                      </BlockArticle>)}
                    </BlockArticles>
                    </BlockContent>
                </Block>
              )
            })}</BlockContent>
          </Block>
          )
        })}
      </div>
    </Loading>
  </ContentContainer>
}
