import {recentArticlesSource, articleDetailSource, siteConfigSource, assetsSource, tagsSource, categoriesSource} from './sources'
import { SanIBuilder } from './builder'
import * as path from 'path'
import { spawn, ChildProcess } from 'child_process'

const root = process.cwd()

const builder = new SanIBuilder({
  // inputDir: path.join(process.cwd(), 'dist/html'),
  inputDir: path.join(root, './dist/html'),
  // outputDir: path.join(process.cwd(), 'public'),
  outputDir: path.join(root, './public'),
  entryHTML: 'index.html'
})

;(async () => {
  let cp: ChildProcess | undefined
  if (process.argv[2]) {
    cp = spawn('node', process.argv.slice(2), {
      stdio: 'pipe'
    })
    await new Promise((resolve, reject) => {
      cp!.stdout?.on('data', data => {
        const line = String(data)
        // console.log(line)
        if (line.indexOf('Nest application successfully') !== -1) {
          resolve(null)
        }
      })
      cp!.on('error', (code) => {
        reject(new Error(`${code}`))
      })
    })
  }
  await builder.prepareFiles()
  const siteConfigData = await builder.cacheSource(siteConfigSource, null)
  const recentArticlesData = await builder.cacheSource(recentArticlesSource, null)
  await builder.createPage('/', [], {
    head: {title: 'XGHeaven Homepage'}
  })
  await builder.createPage('/blog/', [siteConfigData, recentArticlesData], {
    head: {title: 'MineLog'}
  })

  for (const art of recentArticlesData.data) {
    await builder.createPage(`/blog/article/${art.slug}/`, [siteConfigData, await builder.cacheSource(articleDetailSource, art.slug)], {
      head: {title: `${art.title} - MineLog`}
    })
  }

  {
    const tagsData = await builder.cacheSource(tagsSource, null)
    await builder.createPage('/blog/tags/', [siteConfigData, tagsData], {
      head: {title: '标签 - MineLog'}
    })
  }

  {
    const categoryData = await builder.cacheSource(categoriesSource, null)
    await builder.createPage('/blog/categories/', [siteConfigData, categoryData], {
      head: {title: '分类 - MingLog'}
    })
  }

  const assetsData = await builder.cacheSource(assetsSource, null)
  for (const asset of assetsData.data) {
    console.log('cache asset:', asset)
    await builder.cacheAsset(asset)
  }

  await builder.writeFiles()
  console.log('write done')
  cp?.kill('SIGKILL')
})().catch(e => {
  console.error(e)
  process.exit(1)
})
