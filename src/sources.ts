import axios from "axios";
import {
  Article,
  Pagination,
  SimplifyArticle,
  SiteConfig,
  TopCategory,
  TopTag,
} from "./types";
import { SanI } from "./core";

const sani = new SanI({
  sourceKeyMapper: (globalThis as any).__source_data_mapper,
});

const http = axios.create({
  // baseURL: 'http://localhost:4999'
  baseURL: "http://localhost:3000",
});

const get = (
  query: string,
  options: {
    variables?: any;
    environments?: any;
  } = {}
) => {
  return http
    .post(
      "/graphql",
      {
        query,
        variables: options.variables,
        environments: options.environments,
      },
      {
        responseType: "json",
      }
    )
    .then(({ data: { data } }) => data)
    .then((data) => {
      console.log(data);
      return data;
    });
};

function transferArticle(art: any): Article {
  return {
    title: art.title,
    // slot: art.slug,
    // description: art._content.slice(0, 100),
    description: art.intro,
    content: art.content,
    html: art.content,
    raw: art.raw,
    createTime: new Date(art.date).getTime(),
    ...art,
  };
}

function mapSimplifyArticle(art: any): SimplifyArticle {
  return {
    // description: art._content.slice(0, 100),
    description: art.intro,
    createTime: new Date(art.date).getTime(),
    ...art,
  };
}

export const siteConfigSource = sani.createSource<null, SiteConfig>(
  () => `site-config`,
  {
    async remoteSource() {
      const { site } = await get(`
    query {
      site {
        backgroundImage,
        avatar
      }
    }
    `);
      return site;
    },
  }
);

export const recentArticlesSource = sani.createSource<null, SimplifyArticle[]>(
  () => `recent-blog`,
  {
    async remoteSource() {
      const data = await get(`
    query {
      newestArticles {
        slug,
        title,
        date,
        intro,
      }
    }
    `);
      return data.newestArticles.map(mapSimplifyArticle);
    },
  }
);

export const popularArticlesSource = () => `popular-blog.js`;

export const topCategoriesSource = () => `top-categories.js`;

export const categoriesSource = sani.createSource<null, TopCategory[]>(
  () => "/categories",
  {
    async remoteSource() {
      const { categories } = await get(`
    query {
      categories {
        name,
        articles {
          title,
          slug,
          date
        }
      }
    }
    `);
      return categories;
    },
  }
);

export const tagsSource = sani.createSource<null, TopTag[]>(() => `/tags`, {
  async remoteSource() {
    const { tags } = await get(`
    query {
      tags {
        name,
        articles {
          title,
          slug,
          date,
        }
      }
    }
    `);
    return tags;
    // const {data: rawTags} = await http.get<any[]>(`/?q=${encodeURIComponent(`.models.Tag`)}`)
    // return rawTags.map(tag => ({name: tag.name, id: tag._id}))
  },
});

export const articleDetailSource = sani.createSource<string, Article>(
  (slug) => `/article/${slug}`,
  {
    async remoteSource(slug) {
      const { article } = await get(`
      query {
        article(slug: "${slug}") {
          title,
          nodes,
          date,
          slug,
          toc
        }
      }
    `);
      // const {data} = await http.get<any>(`/?q=${encodeURIComponent(`.models.Post.filter(a => a.slug === "${slot}")`)}`)
      return transferArticle(article);
    },
  }
);

export const sideInfoSource = sani.createSource<null, any>(() => `/site-info`, {
  async remoteSource() {},
});

export const articlePage = sani.createSource<
  {
    page: number;
    pageSize: number;
  },
  Pagination<SimplifyArticle>
>(({ page, pageSize }) => `/articles/${pageSize}/${page}`, {
  async remoteSource({ page, pageSize }) {
    const { articles } = await get(`
    query{
      articles(limit: ${pageSize}, offset: ${(page - 1) * pageSize}) {
        totalCount,
        hasNextPage,
        nodes {
          slug,
          title,
          date,
          intro
        }
      }
    }
    `);

    articles.nodes = articles.nodes.map(mapSimplifyArticle);
    return articles;
  },
});

export const assetsSource = sani.createSource<null, string[]>(() => `/assets`, {
  async remoteSource() {
    const { assets } = await get(`
    query {
      assets
    }`);
    return assets;
  },
});
