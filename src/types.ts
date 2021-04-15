export interface ArticleBasic {
  title: string
  slug: string
  description: string
  tags: string[]
  category: string
  createTime: number
  updateTime: number
}

export interface Article extends ArticleBasic {
  content: string
  html: string
  raw: string
  nodes: any
  toc: any
}

export interface SimplifyArticle extends ArticleBasic {
}

export interface SiteConfig {
  avatar?: string
  backgroundImage?: string
}

export interface Category {
  name: string
  id: string
}

export interface TopCategory {
  name: string
  id: string
  articles: SimplifyArticle[]
}

export interface TopTag {
  name: string
  id: string
  articles: SimplifyArticle[]
}

export interface SiteInfo {
  avatar: string
  name: string
}
