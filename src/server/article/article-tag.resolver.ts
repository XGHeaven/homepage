import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { ArticleTag } from "./article-tag.model";
import { ArticleTagService } from "./article-tag.service";
import { Article } from "./article.model";

@Resolver(ArticleTag)
export class ArticleTagResolver {
  constructor(public tagService: ArticleTagService) {}

  @Query((returns) => ArticleTag, { nullable: true })
  async tag(@Args("tagName") tagName: string) {
    return this.tagService.getTag(tagName);
  }

  @Query((returns) => [ArticleTag])
  async tags() {
    return this.tagService.getAllTags();
  }

  @ResolveField("articles", (returns) => [Article])
  async tagFieldArticles(@Parent() tag: ArticleTag) {
    return this.tagService.getTagArticles(tag.name);
  }
}
