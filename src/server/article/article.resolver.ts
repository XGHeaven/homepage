import { Body, Req } from "@nestjs/common";
import { Args, Int, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Environments } from "../environments";
import { ArticleTag } from "./article-tag.model";
import { ArticleTagService } from "./article-tag.service";
import { Article } from "./article.model";
import { ArticleService } from "./article.service";
import { Category } from "./category.model";
import { CategoryService } from "./category.service";

@Resolver(Article)
export class ArticleResolver {
  constructor(
    private articleService: ArticleService,
    private tagService: ArticleTagService,
    private categoryService: CategoryService,
  ) {}

  @Query(of => Article, {nullable: true})
  article(@Args('slug') slug: string, @Body('environments') env: any = {}) {
    console.log(env)
    return this.articleService.getArticle(slug)
  }

  // @Query(of => [Article])
  // articles() {
  //   return this.articleService.getArticles()
  // }

  @Query(of => ArticleTag, { nullable: true })
  tag(@Args('name') name: string) {
    return this.articleService.getTag(name)
  }

  @Query(of => [Article])
  async newestArticles(@Environments() env: any = {}) {
    console.log(env)
    return this.articleService.getNewestArticles()
  }

  @ResolveField('tags', returns => [ArticleTag])
  async articleFieldTag(@Parent() article: Article) {
    return article.tagNames.map(tagName => this.tagService.getTag(tagName))
  }

  @ResolveField('category', returns => [Category])
  async articleFieldCategory(@Parent() article: Article) {
    return this.categoryService.getCategory(article.categoryName)
  }

  @ResolveField('intro', returns => String)
  async articleFieldIntro(@Parent() article: Article, @Args('maxLength', {nullable: true, defaultValue: 240, type: () => Int}) maxLength: number, @Args('matchFragment', {nullable: true, defaultValue: true}) matchFragment: boolean) {
    return this.articleService.getArticleIntro(article.nodes, maxLength)
  }
}
