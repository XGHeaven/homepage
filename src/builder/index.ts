import path from 'path'
import { Source, HeadChildren } from '../core'
import * as fs from 'fs-extra'
import * as url from 'url'
import cheerio from 'cheerio'
import axios from 'axios'
import * as crypto from 'crypto'

export interface SanIBuilderOptions {
  outputDir: string
  entryHTML: string
  inputDir: string,
  sourcePrefix?: string
  assetPrefix?: string
  staticDir?: string | string[]
}

export interface StaticSourceInfo<P, D> {
  source: Source<P, D>
  params: P,
  data: D,
  localPath: string
  dataUri: string
  keyPath: string
  content: string
  hash: string
}

export interface PageStore {
  uri: string
  sources: StaticSourceInfo<any, any>[]
  head?: HeadChildren
}

export class SanIBuilder {
  private outputDir: string
  private inputDir: string
  private entryHTML: string
  private sourcePrefix = '/data'
  private assetPrefix = '/assets'
  private staticDir: string[] = []

  private sourceInfoCache = new Map<string, StaticSourceInfo<any, any>>()
  private pages: PageStore[] = []
  private _html = ''

  constructor(options: SanIBuilderOptions) {
    this.outputDir = path.resolve(process.cwd(), options.outputDir)
    this.inputDir = path.resolve(process.cwd(), options.inputDir)
    this.entryHTML = path.resolve(this.inputDir, options.entryHTML)
    this.sourcePrefix = options.sourcePrefix ?? this.sourcePrefix
    this.assetPrefix = options.assetPrefix ?? this.assetPrefix

    if (options.staticDir) {
      const dirs = Array.isArray(options.staticDir) ? options.staticDir : [options.staticDir]
      this.staticDir = dirs.map(dir => path.resolve(process.cwd(), dir))
    }
  }

  async createPage(targetPath: string, sources: Array<StaticSourceInfo<any, any>>, options: {
    head?: HeadChildren
  } = {}) {
    this.pages.push({
      uri: targetPath,
      sources,
      head: options.head
    })
  }

  async cacheSource<P, D>(source: Source<P, D>, params: P): Promise<StaticSourceInfo<P, D>> {
    const keyPath = source.genKey(params)

    if (this.sourceInfoCache.has(keyPath)) {
      return this.sourceInfoCache.get(keyPath)!
    }

    const data = await source.fetchRemote(params)
    const content = this.buildJSContent(keyPath, data);
    const hash = crypto.createHash('md5').update(content).digest('hex').slice(0, 8).toLowerCase()
    // TODO: 添加 hash
    const dataUri = path.join(this.sourcePrefix, keyPath + `.${hash}.js`)
    const localPath = path.join(this.outputDir, dataUri)

    const info: StaticSourceInfo<P, D> = {
      source,
      params,
      keyPath,
      data,
      localPath,
      dataUri,
      content,
      hash
    }

    this.sourceInfoCache.set(keyPath, info)

    return info
  }

  async cacheAsset(assetUrl: string) {
    const {pathname} = url.parse(assetUrl)
    const targetPath = path.join(this.outputDir, this.assetPrefix, pathname!)
    try {
      const assetData = await (await axios.get(`http://localhost:3000/assets${encodeURI(pathname!)}`, {
      responseType: 'arraybuffer'
    })).data
    await fs.ensureDir(path.dirname(targetPath))
    await fs.writeFile(targetPath, assetData)
    } catch(e) {
      console.error('Cannot cache asset:', assetUrl)
    }
  }

  // 清空文件夹，复制必要的文件
  async prepareFiles(autoClean = true) {
    if (autoClean) {
      await fs.emptyDir(this.outputDir)
    }

    await fs.copy(this.inputDir, this.outputDir, {
      recursive: true,
      filter: (src, dest) => {
        console.log(src)
        if (src === this.entryHTML) {
          return false
        }

        if (src.endsWith('.map')) {
          return false
        }

        return true;
      }
    })
  }

  // 写入资源，比如 data/asset/page
  async writeFiles() {
    const sourceDataMapper = this.getSourceDataMapper()
    // 写入 Page

    for (const page of this.pages) {
      await this.writePage(page, sourceDataMapper)
    }

    // 写入 source data
    for (const info of Array.from(this.sourceInfoCache.values())) {
      await fs.ensureDir(path.dirname(info.localPath))
      await fs.writeFile(info.localPath, info.content)
    }
  }

  private buildJSContent(key: string, data: any) {
    let str = `(window.__static_data = window.__static_data || {})["${key}"] =`
    const startIndex = str.length + 10 + 1
    return `0x${startIndex.toString(16).padStart(8, '0')};${str}${JSON.stringify(data)}`
  }

  private async writePage(page: PageStore, mapper: Record<string, string>) {
    let html = await this.readEntryHTML()
    const $ = cheerio.load(html, {decodeEntities: false})
    const $head = $('head')
    const { head = {}, sources, uri: targetPath} = page
    if (head.title) {
      let $title = $head.find('title')
      if (!$title.length) {
        $title = $('<title></title>')
        $head.append($title)
      }
      $title.text(head.title)
    }

    if (head.description) {
      let $desc = $head.find('description')
      if (!$desc.length) {
        $desc = $(`<meta name="description" content="${head.description}">`)
        $head.append($desc)
      } else {
        $desc.attr('content', head.description)
      }
    }

    if (head.metas) {
      let $metas = $head.find('meta')
      for (const [name, content] of Object.entries(head.metas)) {
        const $meta = $metas.filter((_, meta) => $(meta).attr('name') === name).first()
        if ($meta.length) {
          $meta.attr('content', content)
        } else {
          $head.append(`<meta name="${name}" content="${content}">`)
        }
      }
    }
    const mapperScript = `<script>window.__source_data_mapper=${JSON.stringify(mapper)}</script>`
    const scripts = sources.map(source => `<script src="${source.dataUri}"></script>`).join('')
    $('div#__placeholder__').replaceWith(mapperScript + scripts)
    // html = html.replace('<div id="__placeholder__"></div>', scripts)
    html = $.html()
    const localPath = path.join(this.outputDir, path.join(targetPath, 'index.html'))
    await fs.ensureDir(path.dirname(localPath))
    await fs.writeFile(localPath, html)
  }

  private async readEntryHTML(): Promise<string> {
    if (!this._html) {
      this._html = await fs.readFile(this.entryHTML, 'utf8')
    }

    return this._html
  }

  private getSourceDataMapper() {
    return Array.from(this.sourceInfoCache.entries()).map(([key, info]) => [key, info.dataUri]).reduce<Record<string, string>>((mapper, [key, uri]) => {
      mapper[key] = uri
      return mapper
    }, {})
  }
}

