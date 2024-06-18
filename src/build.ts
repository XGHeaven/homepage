import {
  recentArticlesSource,
  articleDetailSource,
  siteConfigSource,
  assetsSource,
  tagsSource,
  categoriesSource,
  articlePage,
} from "./sources";
import { SanIBuilder } from "./builder";
import * as path from "path";
import { spawn, ChildProcess } from "child_process";

const root = process.cwd();

const builder = new SanIBuilder({
  // inputDir: path.join(process.cwd(), 'dist/html'),
  inputDir: path.join(root, "./dist/frontend"),
  // outputDir: path.join(process.cwd(), 'public'),
  outputDir: path.join(root, "./public"),
  entryHTML: "index.html",
});

(async () => {
  let cp: ChildProcess | undefined;
  if (process.argv[2]) {
    cp = spawn("node", process.argv.slice(2), {
      stdio: "pipe",
    });
    await new Promise((resolve, reject) => {
      cp!.stdout?.on("data", (data) => {
        const line = String(data);
        // console.log(line)
        if (line.indexOf("Nest application successfully") !== -1) {
          resolve(null);
        }
      });
      cp!.on("error", (code) => {
        reject(new Error(`${code}`));
      });
    });
  }
  await builder.prepareFiles();
  const siteConfigData = await builder.cacheSource(siteConfigSource, null);
  const recentArticlesData = await builder.cacheSource(
    recentArticlesSource,
    null
  );
  const articlePages = [
    await builder.cacheSource(articlePage, { page: 1, pageSize: 10 }),
  ];
  while (articlePages[articlePages.length - 1].data.hasNextPage) {
    articlePages.push(
      await builder.cacheSource(articlePage, {
        page: articlePages.length + 1,
        pageSize: 10,
      })
    );
  }

  await builder.createPage("/", [siteConfigData, recentArticlesData], {
    head: { title: "XGHeaven Homepage" },
  });
  await builder.createPage("/blog/", [siteConfigData], {
    head: { title: "MineLog" },
  });

  await builder.createPage("/blog/articles/", [siteConfigData], {
    head: { title: "MineLog" },
  });

  for (const page of articlePages) {
    for (const art of page.data.nodes) {
      await builder.createPage(
        `/blog/article/${art.slug}/`,
        [
          siteConfigData,
          await builder.cacheSource(articleDetailSource, art.slug),
        ],
        {
          head: { title: `${art.title} - MineLog` },
        }
      );
    }
  }

  {
    const tagsData = await builder.cacheSource(tagsSource, null);
    await builder.createPage("/blog/tags/", [siteConfigData, tagsData], {
      head: { title: "标签 - MineLog" },
    });
  }

  {
    const categoryData = await builder.cacheSource(categoriesSource, null);
    await builder.createPage(
      "/blog/categories/",
      [siteConfigData, categoryData],
      {
        head: { title: "分类 - MingLog" },
      }
    );
  }

  const assetsData = await builder.cacheSource(assetsSource, null);
  for (const asset of assetsData.data) {
    console.log("cache asset:", asset);
    await builder.cacheAsset(asset);
  }

  await builder.writeFiles();
  console.log("write done");
  cp?.kill("SIGKILL");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
