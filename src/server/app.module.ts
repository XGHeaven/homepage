import { Module, OnModuleInit } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ArticleTagResolver } from "./article/article-tag.resolver";
import { ArticleTagService } from "./article/article-tag.service";
import { ArticleResolver } from "./article/article.resolver";
import { ArticleService } from "./article/article.service";
import { CategoryResolver } from "./article/category.resolver";
import { CategoryService } from "./article/category.service";
import { AssetsController } from "./assets.controller";
import { AssetsResolver } from "./assets.resolver";
import { AssetsService } from "./assets.service";
import { SiteResolver } from "./site/site.resolver";
import { SiteService } from "./site/site.service";

@Module({
  controllers: [AssetsController],
  providers: [
    ArticleService,
    ArticleTagService,
    CategoryService,
    AssetsService,
    SiteService,

    SiteResolver,
    ArticleResolver,
    ArticleTagResolver,
    CategoryResolver,
    AssetsResolver,
  ],
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    private articleService: ArticleService,
    private articleTagService: ArticleTagService,
    private categoryService: CategoryService
  ) {}

  async onModuleInit() {
    await this.articleService.init("./source/posts/*.md");
    await this.articleTagService.init();
    await this.categoryService.init();
  }
}
