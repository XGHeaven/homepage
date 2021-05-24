---
title: Node Cli 设计上的几点建议
date: 2019-09-07 18:59:29
category:
---

在平时的开发中，我发现大家特别喜欢将很多自己常用或者公司常用的脚本封装成一个 cli，这虽然无可厚非，但是作为一个有强迫症的患者来说，我认为这其实做不好会导致 cli 非常不好用的。所以这里总结了下平时写 cli 的经验希望和大家分享下。

### 写之前请思考

1. 我是不是为了 cli 而去写 cli，换句话我觉得这样比较 cool。如果是，那么请放弃这种想法。
2. 这个 cli 一定会减轻工作量么？
    - 有很多公司喜欢将各种 webpack/eslint/babel 工具封装成一个 cli，那么这真的会降低使用者的工作量么？如果你封装的不好，相反会增加很大的工作量。最神奇的是，封装了这么多工具，配置文件却一个都没少，babelrc/eslintrc/prettierrc，那封装了有何用。
    - cli 的不透明性就会导致使用者永远都是有使用成本的，不论这个 cli 有多简单。他不会知道你是干了什么。所以能避免写一个 cli 就避免写一个 cli。那如果真的要写，有其他方案么？请看第三条
3. 除了写 node cli 真的没有其他方案了么？
    - 大部分情况下，写 shell 的效率远远高于写 cli，将一个命令拆分成多个 shell，然后配合简单的帮助文档即可。如果用户不知道是做什么的，那么直接就可以去看源码。
    - 而且使用 git 管理 shell 也同样高效，比如将个人的一些脚本放到 private github 上，然后直接 clone 下来就可以用了。这样不需要每次都 npm publish，进而污染 npm。
    - 大部分情况下，去写 Makefile/Rakefile 同样可行。当然，Node 生态也有 Jake，不过不推荐用，因为要装 `jake` 包。
    - 如果你这个 cli 是作为一个项目的脚手架工具，那么是不是用 `yeoman` 或者 `degit` 这类工具更好？除非你的项目非常热门，功能自定义程度高，否则完全不需要自己去写一个脚手架。如果你只是觉得好玩，想写一个脚手架的话，那么请去看第一条，问问自己。
    - 如果是一个团队使用，那么除非有很大的普世性，那么用 git 管理同样比 npm 管理要强的多。
4. 最后如果决定一定要写 cli 的话，有必要发布到 npm 么？
    - 是不是发布到自己的 scope 下也是一个不错的选择？
    - 是不是直接让别人通过 `npm install [github.com/user/package](http://github.com/user/package)` 也是一个不错的选择？
    - 是不是上传到公司 or 个人的私有 npm 更好？

### 开发时请遵循以下几点

1. 请使用 npm
2. 不要写死版本号，优先使用 `^`
    - 这是因为有可能你的 cli 会被直接当做依赖安装到项目中，如果你写死了版本号，那么可能会装多分依赖。比如项目依赖了 `yargs@^13.2.0` ，但是你锁死了 `yargs@13.1.0`，就会导致安装两个 yargs。
3. 避免引入一些功能很大，而自己只用其中一部分的包
    - 因为没有 webpack 工具，无法进行 tree shaking，所以导致安装了很多比较大的包。比如你只是用了 `lodash` 的 `cloneDepp` 却安装了整个包。优先使用 `[lodash.xxx](http://lodash.xxx)` 子包。
4. 如果你使用了某些构建工具(babel,webpack,typescript,flow)，那么请将构建之后的文件也加入代码仓库。
    - 比如有一个 `src` 目录存放了 ts 源文件，而 `dist` 存放了构建之后的 js 文件。那么很多人的选择往往是将这 `dist` 文件夹加入 gitignore。这样其实是不太好的，原因如下：
    - 第一，方便追踪变化，比如你自己添加了一些 debug 代码，这个时候构建之后发现没有问题。又把 debug 代码删除，当你提交的时候就可以很清楚的看到自己修改了之后没有构建代码
    - 第二，方便通过 [unpkg.com](http://unpkg.com) 等工具访问
    - 第三，在版本开发依赖升级之后，可以很方便的看到改变的内容。一般使用者会放心升级 cli 之类的开发工具，所以这部分的质量需要我们自己来保证。

### 交互设计上请遵循以下几点

1. Throw as possible，将可能的所有报错向上抛出，是一个好系统所必备的能力。但是在错误展示的时候，可以向用户隐藏部分调用栈信息等，只保留关键信息即可。
2. 尽可能遵循 linux 下的 cli 规范。
3. 不要让用户产生无畏的等待，通过添加进度条或者输出完成列表等告诉用户你依旧是在工作中的。
4. 给予用户想查看所有日志的能力。可以通过 `-v` `-vv` `-vvv` 或者 `--log-level debug` 来控制显示级别
5. 对所有命令的描述都不要超过一行。不论屏幕宽度如何（一般默认 80），最好不要超过 70。如果需要大量描述，请尝试通过 man 或者单独的页面。
6. 帮助是最好的文档，写好 cli 的 help 远比去写好一个文档网站要关键