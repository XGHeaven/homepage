import { Injectable, OnModuleInit } from "@nestjs/common";
import { ArticleTag } from "./article-tag.model";
import { Article } from "./article.model";
import { ArticleService } from "./article.service";

@Injectable()
export class ArticleTagService {
  private tagSlugs = new Map<string, string[]>()

  constructor(public articleService: ArticleService) {}

  async init() {
    this.articleService.getAllArticles().map(article => this.processArticleTag(article))
  }

  getTag(tagName: string): ArticleTag | null {
    if (!this.tagSlugs.has(tagName)) {
      return null
    }
    const tag = new ArticleTag()
    tag.name = tagName

    return tag
  }

  getAllTags() {
    return Array.from(this.tagSlugs.keys()).sort((a, b) => a.localeCompare(b)).map(slug => this.getTag(slug))
  }

  getTagArticles(tagName: string): Article[] {
    return this.tagSlugs.get(tagName)?.map(slug => this.articleService.getArticle(slug)!) ?? []
  }

  private processArticleTag(article: Article) {
    const tags = article.frontmatter.tags as string[]
    if (tags) {
      for (const tagName of tags) {
        this.addArticleToTag(tagName, article.slug)
      }
    }
  }

  private addArticleToTag(tagName: string, slug: string) {
    const slugs = this.tagSlugs.get(tagName)
    if (slugs) {
      slugs.push(slug)
      return;
    }

    this.tagSlugs.set(tagName, [slug])
  }
}
