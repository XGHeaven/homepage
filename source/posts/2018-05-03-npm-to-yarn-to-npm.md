---
title: 为什么我从 npm 到 yarn 再到 npm?
date: 2018-05-03 17:52:35
category: Node.js
tags:
  - npm
  - yarn
  - node
---

> 从接触到 node 环境来说，其中一个不可或缺的一部分便是 npm 包管理，但是由于官方的 npm 有各种各样的问题，于是催生了很多不同的版本，这其中的曲折也许只有过来人才知道。

## 放弃 npm?

### 上古时代

在上古版本(应该是 npm3 以前的版本，具体我也记不清了)，npm 的安装策略并不是扁平化的，也就是说比如你安装一个 `express`，那么你会在 `node_modules` 下面只找到一个 `express` 的文件夹。而 `express` 依赖的项目都放在其文件夹下。

```
- app/
  - package.json
  - node_modules/
    - express/
      - index.js
      - package.json
      - node_modules/
        - ...
```

这个带来的问题或许 windows 用户深谙其痛，因为在这种安装环境下，会导致目录的层级特别高，而对于 windows 来说，最大的路径长度限制在 248 个字符([更多请见此][windows-path])，再加上 `node_modules` 这个单词又特别长，所以你懂得，哈哈哈。解决方案啥的自己去搜索吧，反正估计现在也没人会用上古版本了。

除了 windows 用户出现的问题以外，还有一个更严重的问题，就是模块都是独立的，比如说位于 `express` 下面的 `path-to-regexp` 和 `connect` 下面的 `path-to-regexp` 的模块是两个不同的模块。
那么这个会带来什么影响呢？其实在使用上，并没有什么太大的影响，但是内存占用过大。因为很多相同模块位于不同模块下面就会导致有多个实例的出现(为什么会加载多个实例，请查看 [Node 模块加载][node-module-loader])。你想想，都是同样的功能，为什么要实例这么多次呢？不能就加载一次，复用实例么？

上古时代的 npm 的缺点可以说还是很多的：

- 目录嵌套层级过深
- 模块实例无法共享
- 安装速度很慢，这其中有目录嵌套的原因，也有安装逻辑的问题。因为 npm 是请求完一个模块之后再去请求另一个模块，这就会导致同一个时刻，只有一个模块在下载、解析、安装。

### 软链时代

后面，有人为了解决目录嵌套层次过高的问题，引入的软链接的方案。

简单来说，就是将所有的包都扁平化安装到一个位置，然后通过软链接(windows 快捷方式)的方式组合到 `node_modules` 中。

```
- app/
- node_modules
  - .modules/
    - express@x.x.x/
      - node_modules
        - connect -> ../../connect@x.x.x
        - path-to-regexp -> ../../path-to-regexp@x.x.x
        - ... -> ../../package-name@x.x.x
    - connect@x.x.x/
    - path-to-regexp@x.x.x/
    - ...others
  - express -> ./.modules/express@x.x.x
```

这样做的好处就是可以将整体的逻辑层级简化到很少的几层。而且对于 node 的模块解析来说，可以很好的解决相同模块不同位置导致的加载多个实例，进而导致内存占用的情况。

基于这种方案，有 [npminstall](https://www.npmjs.com/package/npminstall) 以及 pnpm 这个包实现了这种方案，其中 cnpm 使用的就是 npminstall，不过他们实现的方式和我上面讲的是有差异的，[具体请看](https://www.npmjs.com/package/npminstall#node_modules-directory)。简单来讲，他们没有 `.modules` 这一层。更多的内容，请看 npminstall 的 README。

总的来讲这种解决方案有还有以下几个好处：

- 兼容性很好
- 在保证目录足够简洁的情况下，解决了上面的两个问题（目录嵌套和多实例加载）。
- 安装速度很快，因为采用了软连接的方式加上多线程请求，多个模块同时下载、解析、安装。

那么缺点也是挺致命的：

- 一般情况下都是第三方库实现这个功能，所以无法保证和 npm 完全一致的行为，所以遇到问题只能去找作者提交一下，然后等待修复。
- 无法和 npm 很方便的一起使用。最好是要么只用 npm，要么只用 cnpm/pnpm，两者混用可能会产生很奇葩的效果。

## npm3 时代

最大的改变就是将目录层级从嵌套变到扁平化，可以说很好的解决了上面嵌套层级过深以及实例不共享的问题。但是，npm3 在扁平化方案下，选择的并不是软连接的方式，而是说直接将所有模块都安装到 `node_modules` 下面。

```
- app/
- node_modules/
  - express/
  - connect/
  - path-to-regexp/
  - ...
```

如果出现了不同版本的依赖，比如说 `package-a` 依赖 `package-c@0.x.x` 的版本，而 `package-b` 依赖 `package-c@1.x.x` 版本，那么解决方案还是像之前的那种嵌套模式一样。

```
- app/
- node_modules/
  - package-a/
  - package-c/
    - // 0.x.x
  - package-b/
    - node_modules/
      - package-c/
        - // 1.x.x
```

至于那个版本在外面，那个版本在里面，似乎是根据安装的先后顺序有关的，具体的我就不验证了。如果有人知道的话，欢迎告诉我。

在这个版本之后，解决了大部分问题，可以说 npm 跨入了一个新的世界。但是还要一个问题就是，他的安装速度依旧很慢，相比 cnpm 来说。所以他还有很多进步的空间。

## yarn 的诞生

随着 Node 社区的越来越大，也有越来越多的人将 Node 应用到企业级项目。这也让 npm 暴露出很多问题：

- 无法保证两次安装的版本是完全相同的。大家都知道 npm 通过语义化的版本号安装应用，你可以限制你安装模块的版本号，但是你无法限制你安装模块依赖的模块的版本号。即使有 shrinkwrap 的存在，但是很少有人会用。
- 安装速度慢。上文已经讲过，在一些大的项目当中，可能依赖了上千个包，甚至还包括了 C++ Addon，严重的话，安装可能要耗时 10 分钟甚至到达半个小时。这很明显是无法忍受的，尤其是配合上 CI/CD。
- 默认情况下，npm 是不支持离线模式的，但是在有些情况下，公司的网络可能不支持连接外网，这个时候利用缓存构建应用就是很方便的一件事情。而且可以大大减少网络请求。

所以，此时 yarn 诞生了，为的就是解决上面几个问题。

- 引入 yarn.lock 文件来管理依赖版本问题，保证每次安装都是一致的。
- 缓存加并行下载保证了安装速度

那个时候我还在使用 cnpm，我特地比较了一下，发现还是 cnpm 比较快，于是我还是继续使用着 cnpm，因为对于我来说足够了。但是后面发现 yarn 真的越来越火，再加上 cnpm 长久不更新。我也尝试着去了用 yarn，在尝试之后，我彻底放弃了 cnpm。而且直到现在，似乎还没有加入 lock 的功能。

当然 yarn 还不只只有这么几个好处，在用户使用方面：

- 提供了非常简洁的命令，将相关的命令进行分组，比如说 `yarn global` 下面都是与全局模块相关的命令。而且提示非常完全，一眼就能看明白是什么意思。不会像 npm 一样，`npm --help` 就是一坨字符串，还不讲解一下是什么用处，看着头疼。
- 默认情况安装会保存到 dependencies，不需要像 npm 一样手动添加 `-S` 参数
- 非常方便的 yarn run 命令，不仅仅会自动查看 package.json 中 scripts 下面的内容，还是查找 `node_modules/.bin` 下的可执行文件。这个是我用 yarn 最高的频率。比如你安装了 `yarn add mocha`，然后就可以通过 `yarn run mocha` 直接运行 `mocha`。而不需要 `./node_modules/.bin/mocha` 运行。是我最喜欢的一个功能
- 交互式的版本依赖更新。npm 你只能先通过 `npm outdated` 看看那些包需要更新，然后通过 `npm update [packages]` 更新指定的包。而在 yarn 当中，可以通过交互式的方式，来选择那些需要更新，那些不需要。
- 全局模块的管理。npm 管理全局模块的方式是通过直接在 `/usr/lib/node_modules` 下面安装，然后通过软连接连接到 `/usr/local/bin` 目录下。而 yarn 的做法是选择一个目录，这个目录就是全局模块安装的地方，然后将所有的全局模块当做一个项目，从而进行管理。这个好处就是，你可以直接备份这个目录当中的 package.json 和 yarn.lock 文件，从而可以很方便的在另一个地方还原你安装了那些全局模块。至于这个目录的问题，通过 `yarn global dir` 命令就可以找到，mac 下是在 `~/.config/yarn/global/`，linux 我没有测试过。

可以说 yarn 用起来非常舒服，但是唯一的缺点就是不是 npm 官方出的，更新力度、兼容性都会差一些。但这也阻挡不住 yarn 在 Node 社区的火热程度。很快，大家纷纷从 npm 切换到 yarn 上面。

## 重拾 npm 5

在受到 yarn 的冲击之后，npm 官方也决定改进这几个缺点，于是发布了和 Yarn 对抗(这个词是我意淫的)的 npm5 版本。

1. 引入了 package-lock.json，并且默认就会添加，和 yarn.lock 是一样的作用，并且取代之前的 npm shrinkwrap。
2. 默认情况下，安装会自动添加 dependencies，不需要手动书写 `-S` 参数
3. 提升了安装速度，和之前有了很大的进步，但是和 yarn 相比，还是略微慢一些

至此，yarn 和 npm 的差距已经非常非常小了，更多的差距体现在用户体验层面，我使用 yarn 的功能也只剩下全局模块管理、模块交互式更新和 `yarn run` 这个命令了。

但是后面推出的 npx 让我放弃了使用 `yarn run` 这个命令。不是说 npx 比 yarn 有多好，而是说 npm 集成了这个功能，也就没必要再去使用第三方的工具了。而且 npx 还支持临时安装模块，也就是那种只用一次的命令，用完就删掉了。

后面我又发现了 `npm-check` 这个工具，我用它来替代了 yarn 的交互式更新。

然而 npm6 的出现加入了缓存，并且又进一步提升了速度，可以说直逼 yarn。

于是 yarn 对我来说只剩下一个全局模块管理的功能了。我的整个开发流程以及从 yarn 切换回 npm 上面了。或许后面的日子我也会让 npm 来接管全局模块管理，从而放弃使用 yarn。但是我还是会装 yarn，毕竟有一些老项目还是用 yarn 的。

## 总结

我经历了从 npm -> cnpm -> yarn -> (npm + npm-check + npx) 的一个循环，也见证了 npm 社区的一步步发展。而且 yarn 的更新频率也非常慢，可能一个月才更新一次，这也让我逐渐放弃使用 yarn。

有的时候感觉，第三方的终究是第三方，还是没有原生的好用和方便，而且用起来安心。

[windows-path]: https://www.cnblogs.com/52cik/p/node-modules-del.html "Windows 路径长度"
[node-module-loader]: https://github.com/nodejs/node/blob/master/lib/internal/modules/cjs/loader.js "Node 模块加载"
