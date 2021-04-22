import { Injectable } from "@nestjs/common";
import { ArticleService } from "./article.service";
import { Category } from "./category.model";

export const DEFAULT_CATEGORY = "Uncategorized";

@Injectable()
export class CategoryService {
  categoryMap = new Map<string, string[]>();

  constructor(private articleService: ArticleService) {}

  async init() {
    for (const article of this.articleService.getAllArticles()) {
      const { slug } = article;
      const category = article.categoryName || DEFAULT_CATEGORY;

      const slugs = this.categoryMap.get(category);
      if (slugs) {
        slugs.push(slug);
      } else {
        this.categoryMap.set(category, [slug]);
      }
    }
  }

  async getCategory(name: string = DEFAULT_CATEGORY) {
    if (!this.categoryMap.has(name)) {
      return null;
    }

    const category = new Category();
    category.name = name;

    return category;
  }

  async getAllCategory() {
    return await Promise.all(
      Array.from(this.categoryMap.keys())
        .sort((a, b) => a.localeCompare(b))
        .map((name) => this.getCategory(name))
    );
  }

  async getCategoryArticles(name: string) {
    if (!this.categoryMap.has(name)) {
      return [];
    }

    const slugs = this.categoryMap.get(name)!;
    return Promise.all(
      slugs
        .sort((a, b) => a.localeCompare(b))
        .map((slug) => this.articleService.getArticle(slug))
    );
  }
}
