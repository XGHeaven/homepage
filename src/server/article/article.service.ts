import { Injectable } from "@nestjs/common";
import path from "path";
import { globSync } from "glob";
import * as fs from "fs-extra";
import remarkParser from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import remarkSlug from "remark-slug";
import unified, { Processor } from "unified";
import mdtoc from "mdast-util-toc";
import { Article, ArticlePagination } from "./article.model";
import { Root, Content } from "mdast";
import YAML from "js-yaml";
import visit from "unist-util-visit";
import filter from "unist-util-filter";
import map from "unist-util-map";
import { Node } from "unist";
import { ArticleTag } from "./article-tag.model";
import { Collection } from "../collection";
import { AssetsService } from "../assets.service";

type TreeNode = Node & {
  value?: string;
  children?: TreeNode[];
};

type SerializedTreeNode = Omit<TreeNode, "position" | "children"> & {
  children?: SerializedTreeNode[];
};

@Injectable()
export class ArticleService {
  private files: string[] = [];
  private articles = new Map<string, Article>();
  private tags = new Map<string, ArticleTag>();
  private collection = new Collection<Article>(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  constructor(private assets: AssetsService) {}

  getArticle(slug: string) {
    return this.articles.get(slug);
  }

  getArticlesPagination(limit: number, offset: number) {
    const page = new ArticlePagination();
    const allArticles = this.getAllArticles();
    page.totalCount = allArticles.length;
    page.nodes = allArticles.slice(offset, offset + limit);
    page.hasNextPage = limit + offset < allArticles.length;
    return page;
  }

  // Get Top 10
  getNewestArticles() {
    return this.getAllArticles()
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10);
  }

  getTag(name: string) {
    return this.tags.get(name);
  }

  async init(pattern: string) {
    const files = globSync(pattern);
    await Promise.all(
      files.map((file) =>
        this.loadMarkdownFile(path.join(process.cwd(), file)).catch((e) => {
          console.error(file);
          console.error(e.message);
          return Promise.reject(e);
        })
      )
    );
  }

  async loadMarkdownFile(mdPath: string) {
    const content = await fs.readFile(mdPath, "utf8");
    const { assets } = this;
    const file = await unified()
      .use(remarkParser)
      .use(remarkFrontmatter)
      .use(remarkSlug)
      .use(() => {
        return ((ast, file) => {
          const article = new Article();
          let frontmatter: any;
          const root = ast as Root;
          const firstChild = root.children[0] as TreeNode | undefined;

          if (firstChild?.type === "yaml") {
            article.frontmatter = frontmatter = YAML.load(
              firstChild.value ?? "",
              {
                json: true,
              }
            );
          } else {
            article.frontmatter = frontmatter = {};
          }

          const slug =
            article.frontmatter.slug ||
            path.basename(mdPath, path.extname(mdPath));
          article.slug = slug;

          const title =
            article.frontmatter.title || `${slug}(Untitled)`;
          article.title = title;

          const date = new Date(article.frontmatter.date);
          article.date = date;

          if (frontmatter.tags) {
            article.tagNames = frontmatter.tags;
          } else {
            article.tagNames = [];
          }

          if (frontmatter.category) {
            article.categoryName = frontmatter.category;
          } else {
            // article.categoryName = ''
          }

          if (frontmatter.coverImage) {
            const coverImage = frontmatter.coverImage as string;
            if (coverImage.startsWith("http")) {
              article.coverImage = coverImage;
            } else {
              const absolutePath = path.resolve(
                path.dirname(mdPath),
                slug,
                coverImage
              );
              const uri = path.join(`article/${slug}`, coverImage);
              const assetUri = this.assets.add(uri, absolutePath);
              article.coverImage = assetUri;
            }
          }

          file.data = Object.assign(file.data ?? {}, {
            article,
          });
        });
      })
      .use(function (this: Processor) {
        return (root, file) => {
          const { article } = file.data as { article: Article };
          const { slug } = article;
          return map(root, (_node) => {
            const node = _node as Content;
            if (node.data?.skip) {
              return node;
            }
            switch (node.type) {
              case "image": {
                const { url } = node;
                if (!url.startsWith("http")) {
                  // 相对路径
                  const uri = path.join(`article/${slug}`, url);
                  const assetUri = assets.add(
                    uri,
                    path.join(path.dirname(mdPath), slug, url)
                  );
                  node.url = assetUri;
                }
                break;
              }

              case "text": {
                const text = node.value.trim();
                if (text.startsWith("{%") && text.endsWith("%}")) {
                  // Hexo 标记符号处理
                  const [command, ...args] = text
                    .slice(2, -2)
                    .trim()
                    .split(" ");
                  switch (command) {
                    case "asset_img": {
                      const [imgPath] = args;
                      const uri = path.join(`article/${slug}`, imgPath);
                      const imgUri = assets.add(
                        uri,
                        path.resolve(path.dirname(mdPath), slug, imgPath)
                      );
                      return {
                        type: "image",
                        url: imgUri,
                        title: "",
                        alt: null,
                        data: { skip: true },
                      };
                    }
                  }
                }
                break;
              }
            }

            return node;
          });
        };
      })
      .use(function (this: Processor) {
        return ((ast, file) => {
          const toc = mdtoc(ast);

          file.data = Object.assign(file.data ?? {}, {
            ast,
            toc,
          });
        });
      })
      .use(function (this: Processor) {
        this.Compiler = (e) => "";
      })
      .process(content);

    const { ast, toc, article } = file.data as {
      ast: Root;
      toc: mdtoc.TOCResult;
      article: Article;
    };
    const filteredAst = filter(
      ast,
      { cascade: false },
      (node: unknown): node is Node => {
        const currentNode = node as Node;
        return currentNode.type !== "yaml" && currentNode.type !== "toml";
      }
    ) as TreeNode | undefined;

    article.nodes =
      this.transformAST2JSON(filteredAst)?.children ?? [];
    article.toc = toc.map;

    if (!article.frontmatter.title) {
      const firstTocSection = (toc.map as TreeNode | undefined)?.children?.[0];
      const firstTocNode = firstTocSection?.children?.[0];
      article.title = this.toPureString(firstTocNode) || article.title;
    }

    this.articles.set(article.slug, article);
    // this.collection.push(article)
  }

  getArticleIntro(nodes: Content[], maxLength: number) {
    // TODO: 有待改进
    let str = "";
    visit({ type: "root", children: nodes } as Root, (node: any) => {
      switch (node.type) {
        case "text": {
          if (str.length < maxLength) {
            str += node.value as string;
          }
          break;
        }
      }
    });

    return str.slice(0, maxLength);
  }

  toPureString(ast: Node | undefined) {
    const strs: string[] = [];

    if (ast) {
      visit(ast, (node: any) => {
        switch (node.type) {
          case "text": {
            strs.push(node.value as string);
            break;
          }
        }
      });
    }

    return strs.join("");
  }

  private transformAST2JSON(node: TreeNode | undefined): SerializedTreeNode | undefined {
    if (!node) {
      return;
    }
    // delete position
    const { position, ...newNode } = node;
    const serializedNode = newNode as SerializedTreeNode;
    if (Array.isArray(node.children)) {
      serializedNode.children = node.children
        .map((child) => this.transformAST2JSON(child))
        .filter(
          (child): child is SerializedTreeNode => child !== undefined
        );
    }

    return serializedNode;
  }

  getAllArticles(): Article[] {
    return Array.from(this.articles.values()).sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );
  }
}
