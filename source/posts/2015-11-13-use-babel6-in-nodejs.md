---
title: Use ES6 with babel6 in nodejs
date: 2015-11-13 15:49:56
categories: Node.js
tags:
  - Node.js
  - ECMAScript 6
---

<!-- toc -->

# 什么是`Babel`
相信很多新手没有听说过`Babel`和`ES6`，如果你是老手的话，那么请自动忽略~

## ES6
`ES6`也就是`ECMAScript 6`，也就是最新的一代js规范，添加了很多语言的特性，包括模块管理，类，块级作用域等等内容。我最喜欢的就是箭头函数，优雅~

## Babel
然而虽然`ES6`很棒，但是现在几乎没有浏览器或者Node（我记得5.0已经全部支持了es6，可是为啥我试着却不行。。。似乎要开启全部的harmony）能够完全支持es6的代码，那么问题来了，如果我想体验一下es6的代码，怎么办？？

一个很简单的思路便是：

> 我写个程序，将es6代码转换成es5代码进行运行不就好了，很棒

而`Babel`就是干的这个事情。

# babel5 和 babel6 的区别
对于`Babel`来说，现在有了两个版本，一个是5，一个是6，那么两者有什么区别呢？

- 5对新手更加友好，因为只需要安装一个`babel`就可以了，而6需要安装比较多的东西和插件才可以。
- 相比5来说，6将命令行工具和API分开来了，最直观的感觉就是，当你想在代码中运行es6代码的话，需要安装`babel-core`，而如果你想在终端编译es6或者是运行es6版本的REPL的话，需要安装`babel-cli`
- 也许有人问，原先的`babel`去哪了？是这样的，这个`babel`的package到了6版本之后虽然还是能安装，但是已经不具有任何的有效的代码了。取而代之的是一段提示文字，提示你需要安装`babel-core`或者`babel-cli`。所以你在babel6的情况下，完全不需要安装`babel`
- 6将babel插件化，当你第一次安装`babel-core`并且按照以前的方式来加载require hook的话，你回发现代码无法运行：
	```
	require('babel-core/register');
	```
就是因为babel6整体插件化了，如果你想使用es6语法，需要手动加载相关插件。

这里有一篇文章，建议看一下[《The Six Things You Need To Know About Babel 6》](http://jamesknelson.com/the-six-things-you-need-to-know-about-babel-6/)

---

# Quick Start

## 建立空文件夹 babel6
建立空文件夹babel6作为本次的目录，并`npm init`

## 安装`Babel6`

```
npm install babel-core --save
```

如果觉得慢，可以使用淘宝镜像`cnpm`。
此时，基础的babel6就安装完成了，如果你想安装babel5，那么执行如下的代码

```
npm install babel@5 --save
```

即可使用babel5，那么在后文的中，统一使用babel6

![安装babel6](install-babel6.gif)

## require hook
安装好之后，问题来了，如何使用呢？

相信使用过`coffee`的人一定知道`register`，那么在babel中同样不例外，也可以使用同样的方法。

{% codeblock start.js %}
require('babel-core/register');

require('./app');
{% endcodeblock %}

大家可能以为这样我就可以在`app.js`中优雅的使用es6了，在babel5中确实是这样的，但是在babel6中，却不一样了。

如果你这样写完，并没有任何作用，因为你缺少一个插件。

## 安装插件
如果想使用`es6`语法，必须安装一个插件
```
npm install babel-preset-es2015
```

然后在文件夹下面创建一个叫`.babelrc`的文件，并写入如下代码：
{% codeblock .babelrc %}
{
	"presets": ["es2015"]
}
{% endcodeblock %}

下面你就可以很优雅的书写你的es6代码了。
![安装es2015插件](install-es2015.gif)

## 书写优雅的`ES6`代码

下面我们写一段优雅的代码

{% codeblock app.js %}
let first = (size, ...args) => [...args].slice(0, size);

export default first;

console.log(first(2,1,2,3));
{% endcodeblock %}

## Run it
直接运行，不说话~~~
![Run it](run-it.gif)

---

# 内容解释

## .babelrc
什么是`.babelrc`文件呢？熟悉linux的同学一定知道，rc结尾的文件通常代表运行时自动加载的文件，配置等等的，类似bashrc,zshrc。同样babelrc在这里也是有同样的作用的，而且在babel6中，这个文件必不可少。

- 里面可以对babel命令进行配置，以后在使用babel的cli的时候，可以少写一些配置
- 还有一个`env`字段，可以对`BABEL_ENV`或者`NODE_ENV`指定的不同的环境变量，进行不同的编译操作


### "presets"

这个是babel6新加的，就是代表需要启动什么样的预设转码，在babel6中，预设了6种，分别是

- es2015
- stage-0
- stage-1
- stage-2
- stage-3
- react

至于如何安装，请查看[balel官网](http://babeljs.io/docs/plugins/)

而且，对`.babelrc`的设置，你可以存放在package.json中的。如下：

```
{
	...
	"babel": {
		"presets": ["es2015"]
	},
	...
}
```

## require hook
require hook 的作用就是替换原先的require，以便在加载自动对代码进行编译，运行。

其实这个做的便是重写`require.extensions`中对应的扩展名的加载程序，并且默认会判断这个文件是否是`node_modules`中的模块，如果是的话，那么将不会进行转换。否则的话，会进行转换。

## CLI
其实babel也可以当做全局变量来使用的

```
npm install babel-cli -g
```

安装上后，会安装如下四个程序到全局环境中：
- babel
- babel-node
- babel-doctor
- babel-external-helpers

### babel
这个就是编译js文件的全局变量，具体如何使用，大家请参照官网。使用方法和coffee，style，less了类似，就不多讲了

### babel-node
这里主要说一下这个东西，就是这个的作用就是提供一个`node`命令相同的REPL环境，不过这个环境会在执行之前讲代码进行编译。

> 坑1：上文讲到，babel6默认是无法编译es6文件的，需要你手动安装`es2015`的preset，同样，全局模式下，也需要这个preset。

那么问题来了，我们怎么安装这个preset呢？global？所以这是一个坑，我在babel的[issue](https://github.com/babel/babel/issues/2816)中找到这样的一条。作者给出这样的回答：我们处理preset和plugin是依据于输入的文件，而你直接运行CLI是没有输入文件的，也就无法定位preset和plugin的位置。言下之意就是不要全局安装，虽然我们给你了你全局安装的方式。然后作者关闭了issue，表示很无奈。。。。

> 解决方案1： 经过寻找，找到一种解决方案，就是创建一个空项目，安装`babel-preset-es2015`，并写入对应的配置进入`.babelrc`，然后在这个目录下运行`babel-node`即可正常运行

不过这种方式太麻烦了，所以，如果大家想体验一下es6的REPL的话，建议安装babel5

```
npm install babel@5 -g
```

### babel-doctor
就是检查babel状况的，
主要检查以下几个内容

- 是否发现了`.babelrc`配置文件
- 是否有重复的babel安装包，比如说安装了5和6
- 所有的babel安装包是否已经升级到了最新版
- 并且 npm >= 3.3.0

### babel-external-helpers
就是讲一些公共的帮助函数提取成一个文件，其实就做了这一个作用。。。

# 总结
这是我的第一篇关于es6的教程，如果大家有什么不好的地方，请及时想我反馈

# 更新
2015-11-15 添加了CLI
