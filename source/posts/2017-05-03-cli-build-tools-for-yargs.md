---
title: 命令行构造工具之 yargs 详细介绍
date: 2017-05-03 18:55:43
categories: Node.js
tags:
  - Node.js
  - CLI
  - yargs
---

<!-- TOC -->

# 命令行工具构造工具之 yargs

## 简介

话说 yargs 是什么呢？简单来说，就是用来解析 cli 参数的。话不多说，我们来简单了解一下。



## 光速开始

### .argv 一切的开始，简单的不要不要的

使用这个最简单的方式就是直接调用 `.argv` 这个 getter，他会自动对 `process.argv` 进行解析。并返回解析后的对象。

```javascript
// argv.js
const argv = require('yargs').argv;
console.dir(argv)
```

```bash
# node argv.js -v --version --name whos
{ _: [], v: true, version: true, name: 'whos', '$0': 'argv.js' }
```

什么缩写，什么参数，统统搞定。是不是 so easy。

在默认情况下，所有的参数只有三种值，`Boolean`、`String`、`Array<Boolean|String`。

而且 `$0` 代表当前脚本的名称，这个就不多讲了

参数后面可以使用空格或者 `=` 。例如 `-d=ok —name=bill`

#### 普通参数
如果参数没有 `-` 开头，那么将它放入 `_` ，简称为普通参数

```bash
# node argv.js a b c
{ _: [ 'a', 'b', 'c' ], '$0': 'argv.js' }
```

#### 简写参数
如果参数只有一个 `-` 开头，那么后面的参数为缩写参数，缩写参数的值默认设置成 `true`。

```bash
# node argv.js -a -b -c
{ _: [], a: true, b: true, c: true, '$0': 'argv.js' }
```

同时，`yargs` 支持将缩写参数合并在一起书写。

```bash
# node argv.js -abc
{ _: [], a: true, b: true, c: true, '$0': 'argv.js' }
```

效果和上面是一样的。

如果缩写参数后面跟着普通参数，那么缩写参数的值就会自动设置成普通参数的值而不再是 `true`。

```bash
# node argv.js -a haha -b lala -c hehe
{ _: [], a: 'haha', b: 'lala', c: 'hehe', '$0': 'argv.js' }
```

那么有人问了，如果我这样写会怎么样？ `-abc hahaha`，let's try.

```bash
# node argv.js -abc hahaha
{ _: [], a: true, b: true, c: 'hahaha', '$0': 'argv.js' }
```

结果显示，其实就和

```bash
# node argv.js -a -b -c hahaha
```

是一样的，可以见得，代码中其实就是将 `-abc` 拆成了 `-a -b -c` 进行解析的。

#### 全写参数
除去上面两种参数，就剩下全写参数（不要吐槽为啥叫全写参数，因为实在是不知道该叫什么名字）

全写参数和缩写参数差不多，只不过他不能合并成一个书写，其他都是一样的

```bash
# node argv.js --version --laugh haha
{ _: [], version: true, laugh: 'haha', '$0': 'argv.js' }
```

#### 结果合并

作为一个好 Module ，怎么会没有考虑到下面这种奇葩情况呢？

```bash
# node argv.js -a -a -a -a -a -a -a
```

大家猜猜会是什么结果 :) 此处略过 10000 秒。

```bash
{ _: [],
  a: [ true, true, true, true, true, true, true ],
  '$0': 'argv.js' }
```

没错，`yargs` 将每一个参数单独处理，然后最后合并成了一个数组，是不是很有意思，也就是说你可以写出下面的东东。

```bash
# node argv.js --fuck whose --fuck your --fuck daddy --fuck
{ _: [],
  fuck: [ 'whose', 'your', 'daddy', true ],
  '$0': 'argv.js' }
```

最简单的模式，也是最有趣的模式，值得去玩。

### 我就要你在我的身边，`.demandOption(key, msg)`

如果你需要某个参数一定存在，这怎么办呢？难道要自己手动 `if` 一下，那真的好蠢啊。

`.demandOption` 就是这么来了

```javascript
// demand.js
const argv = require('yargs').demandOption('baby').argv
console.dir(argv)
```

`baby` 在，世界一切太平，不管他是怎么在我的身边的。

```bash
# node demand.js --baby
{ _: [], baby: true, '$0': 'demand.js' }
# node demand.js --baby I
{ _: [], baby: 'I', '$0': 'demand.js' }
# node demand.js --baby --baby --baby --baby I
{ _: [], baby: [ true, true, true, 'I' ], '$0': 'demand.js' }
```

`baby` 不在，世界爆炸(exit code != 0)

```bash
# node demand.js
Options:
  --baby                                     [required]

Missing required argument: baby
```

`.demandOption(key, msg)` 的 `key` 支持数组和字符串，分别表示单个和多个 `required` 的参数。而第二个参数值在没有满足条件的时候显示的文字。

### 啥？你嫌我太长？还是太短:)`.alias`

>  俗话说的好，参数太长怎么办，变短一点喽

其实是我自己说的，可以给一个命令取一个别名，不管是变长还是变短，都很简单。

```javascript
// alias.js
const argv = require('yargs').alias('long', ['l', 'lo']).alias('short', 's').argv
console.dir(argv)
```

```bash
# node alias.js -l --long --lo -s --short
{ _: [],
  l: [ true, true, true ],
  long: [ true, true, true ],
  lo: [ true, true, true ],
  s: [ true, true ],
  short: [ true, true ],
  '$0': 'alias.js' }
```

可以看到 `l` `lo` `long` 是一样的，`s` `short` 是一样的，可长可短，自由随意。

###  你要我怎样我就怎样，`.boolean` `.array` `.number` `.count` `.choices`

有的时候，需要某些参数是固定的格式，而不是其他的方式，那么就需要这些方法来描述一个参数的类型。这些参数对于 `alias` 之后的参数同样也是可以的。

#### `.array(key)`

顾名思义，直接将参数的类型设置为数组，他会将后面所有的非普通参数作为当前参数的值。

```javascript
// array.js
const argv = require('yargs').array('girls').argv
console.dir(argv)
```

```bash
# node array.js --girls Abby Aimee --stop --girls Alisa Angelia Amanda
{ _: [],
  girls: [ 'Abby', 'Aimee', 'Alisa', 'Angelia', 'Amanda' ],
  stop: true,
  '$0': 'array.js' }
```

#### `.boolean(key)`

将参数类型设置为 `Boolean` 类型。如果后面的类型不是 `Boolean` 类型(`true`、`false`)，那么将不会设置为当前参数的值，并且当有多个的时候，不会合并成数组。

```javascript
// boolean.js
const argv = require('yargs').boolean('love').argv
console.dir(argv)
```

```bash
# node boolean.js I --love you and --love again
{ _: [ 'I', 'you', 'and', 'again' ],
  love: true,
  '$0': 'boolean.js' }
```

#### `.number(key)`

将参数类型设置为 `Number` 类型。基本规则如下：

1. 如果没有填写值，那么默认是 `undefined`
2. 如果设置的值不合法，那么是 `NaN`
3. 否则是格式化为数字，使用 `Number` 构造方法

```javascript
// number.js
const argv = require('yargs').number(['bust', 'waist', 'hips', 'height']).argv
console.dir(argv)
```

```bash
# node number.js --bust --waist 24 --hips zz
{ _: [], bust: undefined, waist: 24, hips: NaN, '$0': 'number.js' }
```

#### `.count(key)`

统计一下这个参数被使用了多少次，使用 `.count` 之后，参数默认就变成了 `Boolean` 类型，但是只统计他出现的次数。经常用来作为设置 debug 的输出级别。

```javascript
// count.js
const argv = require('yargs').count('v').count('people').argv
console.log(argv)
```

```bash
# node count.js -v -vv --people --people false
{ _: [], v: 3, people: 2, '$0': 'count.js' }
```

#### `.choices(key, list)`

设置某个参数只能为某些值，可以和`number` `boolean` `count` 组合。

其本质是 `indexOf` 操作，也就是 `===` 做比较操作，所以这也就是为啥 `array` 不能和他匹配的原因。

```javascript
// choices
const argv = require('yargs')
	.choices('look', ['beatuify', 'oh, god'])
	.choices('time', [1,2,3,4]).number('time')
	.choices('many', [1,2]).count('many')
	.argv
console.dir(argv)
```

```bash
# node choices.js --look "oh, god"
{ _: [], look: 'oh, god', '$0': 'choices.js' }

# node choices.js --look no
Invalid values:
  Argument: look, Given: "no", Choices: "beatuify", "oh, god"

# node choices.js --time 1
{ _: [], time: 1, '$0': 'choices.js' }

# node choices.js --time 5
Invalid values:
  Argument: time, Given: 5, Choices: 1, 2, 3, 4

# node choices.js --many --many
{ _: [], many: 2, '$0': 'choices.js' }

# node choices.js --many --many --many
Invalid values:
  Argument: many, Given: 3, Choices: 1, 2
```


### 听说你和别人有千丝万缕的关系:( `.conflicts` `.implies`

简单一说：
* `.implies(我, 她)` 有我先有她，有她不一定有我
* `.confilcts(我, 他)` 有我没他，有他没我

如果两个都存在在一个参数上面的时候，`implies` 优先级会更高。

```javascript
// imcon.js
const argv = require('yargs')
	.conflicts('me', 'him')
	.implies('me', 'her')
	.argv
console.dir(argv)
```

```bash
# node imcon.js --me --him --her
Arguments me and him are mutually exclusive

# implies 有更高的优先级
# node imcon.js --me --him
Implications failed:
  me -> her

# node imcon.js --me
Implications failed:
  me -> her

# node imcon.js --me --her
{ _: [], me: true, her: true, '$0': 'imcon.js' }

# node imcon.js --him --her
{ _: [], him: true, her: true, '$0': 'imcon.js' }
```

### 可以

### 大家在一起吧 :) `.option` `.options`

其实就是将上面的的所有的命令合并成一个 object，里面的 `key` 就是对应的函数名，而值就是参数。只不过 `.options` 是很多 `.option` 的集合。

这个就请看官网的[例子](http://yargs.js.org/docs/#methods-optionskey-opt)和[源码](https://github.com/yargs/yargs/blob/master/yargs.js#L176)

#### 有用但是很简单其余参数

* `.default` `.defaults` 设置默认参数值
* `.describe` 对参数的描述
* `.usage` 设置命令的提示的使用方法
* `.help` 设置帮助的指令，添加 `--help` ，但是没有 `-h` ，需要手动添加，可以选择是否添加 `help` 子命令
* `.group` 分组，比如可以设置启动参数为一组，停止参数为一组，只是看起来比较舒服一些，并不影响什么内容。
* `.normalize` 对参数的值用 `path.normalize`
* `.version` 添加版本显示参数 `--version`，不过不添加缩写参数
* `.wrap` 设置信息输出的最大的列宽度，比如说 `--help` 显示帮助参数。`.wrap(null)` 取消列宽限制，`.wrap(require('yargs').terminalWidth())` 设置为当前宽度。默认是 `Math.min(80, windowWidth`


### 小弟来了 (-_-) `.command`

最简单的就是想实现类似 git 的那样的带有子命令的命令行操作，那么就需要这个东西。

他有如下的参数：

* `.command(cmd, desc, [builder], [handler])`
* `.command(cmd, desc, [module])`
* `.command(module)`
* `builder` 是构造器，可以是 `Object|yargs => {}`，如果是对象，那么和 `.options` 是一样的。如果是函数，参数是 `yargs` 可以通过上面的函数添加参数。
* `handler` 是处理器，当解析完成后，传入解析的结果，此时可以对结果进行处理。
* `module` 最简单了，就是有
  * `command` 命令名
  * `aliases` 别名
  * `describe` 描述
  * `builder` 构造器
  * `handler` 处理器

当匹配到一个命令的时候， `yargs` 会做如下处理：

1. 把当前命令输入到当前作用域中
2. 清空所有的非全局的配置
3. 如果传入了 `builder`，就通过其设置当前命令
4. 解析和验证参数
5. 如何一切正常，那么运行 `handle`，如果传入了的话
6. 从当前作用域中弹出

#### 这个位置是你的，别人抢不走 `[arg1] <arg2>`

有的时候希望命令必须要接受一个参数，或者接受一个可选参数，那么可以对命令使用 `<>` 和 `[]` 设置他的位置。`<>` 表示这个命令必须要有，`[]` 表示这个参数可选。

有如下规则：

* 通过 `|` 设置别名，例如 `[name|username]` ，在最后的解析中，`name` 和 `username` 是一样的。
* 最后一个可选参数支持添加 `…` 变成可变参数，例如 `downloadto <from> [to…]` 那么 `to` 是一个数组，并且必须要是命令中的最后一个可选参数才能变成可变参数。

```javascript
// like.js
const argv = require('yargs')
	.command('like <who>', 'you like who', {}, arg => console.dir(arg))
	.command('dislike [who]', 'you dislike who', {}, arg => console.dir(arg))
	.argv
console.dir(argv)
```

```bash
# node like.js like you
{ _: [ 'like' ], '$0': 'like.js', who: 'you' }
{ _: [ 'like' ], '$0': 'like.js', who: 'you' }

# node like.js like
like.js like <who>

Not enough non-option arguments: got 0, need at least 1

# node like.js dislike
{ _: [ 'dislike' ], '$0': 'like.js' }
{ _: [ 'dislike' ], '$0': 'like.js' }

# node like.js dislike you
{ _: [ 'dislike' ], '$0': 'like.js', who: 'you' }
{ _: [ 'dislike' ], '$0': 'like.js', who: 'you' }
```

#### 默认命令 `*`

有的时候当没有任何命令匹配到的时候，希望有一个默认匹配的，那么可以用 `*` 代替普通命令的位置。

```javascript
// defaultCommand.js
const argv = require('yargs')
	.command('*', 'default command', {}, () => console.log('called command'))
	.argv
console.dir(argv)
```

```bash
# node defaultCommand.js --name
called command
{ _: [], name: true, '$0': 'defaultCommand.js' }
```

#### 方便一点 `.commandDir`

表示直接从文件夹中动态加载命令。详情请参考[文档](http://yargs.js.org/docs/#methods-commanddirdirectory-opts)

### 从别的地方来 `.config` `.env` `.coerce`

写到这里，作者累了，所以：

* `.config` 动态的从命令行中接受一个 `json` 文件路径，并自动加载。 [doc](http://yargs.js.org/docs/#methods-configobject)
* `.env` 设置环境变量的前缀，自动将这些前缀的环境变量去掉前缀，使用小驼峰和下划线方式加载。[doc](http://yargs.js.org/docs/#methods-envprefix)
* `.coerce` 获取到变量值之后转化成别的值。[doc](http://yargs.js.org/docs/#methods-coercekey-fn)

还有很多细节的，不过我觉得文档挺详细的，我就不多说了。



## 总结

感觉还是不错的，接口很简单，也通俗易懂。相比 `commander` 是两种不同的风格。`commander` 上手简单，但是前置知识有一些，而 `yargs` 相比前置知识的要求比较少，而且更加灵活。
