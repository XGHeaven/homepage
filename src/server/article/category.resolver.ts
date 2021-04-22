import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Article } from "./article.model";
import { Category } from "./category.model";
import { CategoryService } from "./category.service";

@Resolver(Category)
export class CategoryResolver {
  constructor(private categoryService: CategoryService) {}

  @Query((returns) => Category, { nullable: true })
  async category(@Args("name", { nullable: true }) name?: string) {
    return this.categoryService.getCategory(name);
  }

  @Query((returns) => [Category])
  async categories() {
    return this.categoryService.getAllCategory();
  }

  @ResolveField("articles", (returns) => [Article])
  async categoryFieldArticles(@Parent() category: Category) {
    return this.categoryService.getCategoryArticles(category.name);
  }
}
