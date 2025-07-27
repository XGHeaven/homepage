autoGenerateFrom: notion
title: 学 QuickJS 太难？不如来看看这个 TypeScript 实现的平替项目
date: 2024-06-05T00:00:00.000Z
category: Frontend
tags:
  - QuickJS
  - JSVM


---

<!-- toc -->

不知道有多少前端，曾经像我一样，尝试去学习 V8 让自己可以从底层更好的了解 JS 的实现。但是由于太复杂而放弃，光下载、编译、调试足够让人望而却步了，更别说你需要有足够的 C++ 经验。

幸运的是，Bellard 大佬不久便开源用纯 C 实现的轻量且高性能的 QuickJS，这让我重新燃起了学习的热情，这个项目简单到仅仅有高中的 C 语言知识和数据结构就可以阅读。

无论如何，其还是用 C 实现的，内部会有很多 C 语言的 hack 写法（为了性能），阅读起来也不是那么的流畅。正巧我就是研究小程序的，小程序内部限制了动态脚本的执行，不如顺势把 QuickJS 迁移到 TypeScript 上，这样在小程序中也可以做到动态脚本执行了！

于是，这个项目便诞生了，我将其命名为 `jsscript`，[https://github.com/XGHeaven/jsscript](https://github.com/XGHeaven/jsscript)

# jsscript

> 目前这个项目还在开发中，部分能力缺失，只是我个人能力有限，JS 引擎又是一个很大的内容，很难短时间内完全支持，但最终的目标是不变的。

在立项之初，我了解到社区内有很多类似的项目都可以实现相同的功能，所以在一开始，我就觉得尽量不合他们的特性或者能力重叠，而是将更多的精力放在学习、易用性上：

- **原生 ES6、ESNext 支持**。截止写文时，[test262](https://github.com/tc39/test262) 覆盖率为 25%。

- **易维护**。项目用纯 TypeScript 编写，所有的操作函数和参数都有完整的类型提示。

- **易阅读**。代码核心逻辑和 QuickJS 几乎无异，核心 API 命名大部分也保持一致，数据结构有所不同，使之更加适合于 TypeScript。

- **易修改**。项目内几乎所有能力都是可插拔的，你甚至可以把所有内置的对象（例如 Array、Function）删除，变身成普通的表达式计算器，按需定制。

- **Tree Shaking 友好**。代码全部以无副作用和函数的方式提供（部分封装会用 class），只要你不用，就不会被打包进去，体积随你所控。

- **架构简易**。所有的事件循环依赖外部环境（例如 Node、Browser）、部分内置对象的原型方法直接代理到外部环境、只支持严格模式等。

有人好奇，为啥我这里没有列出来性能呢？一般这种项目不都是要做到第一的性能么？

其实，自从我决定将可读性、易用性、灵活性作为首要目标的时候，性能就不再是核心目标了。原因也很简单，这两者很难兼得。当然，性能也会是考虑的点，但不是现在的目标。

# 与 QuickJS 的对照

## 启动流程

QuickJS 的基本启动流程可以简单理解为：

- 创建 Runtime

  - Runtime 提供了执行 JavaScript 代码所需的基础设施和功能,如内存管理、垃圾收集、事件循环等。

  - Runtime 是整个 JavaScript 执行过程的基础，简单理解就是初始化一个引擎。

- 然后通过 Runtime 创建 Context

  - Context 指的是 JavaScript 代码执行时的执行环境或上下文。

  - 这两者之间的关系是一对多的，也就是说一个 Runtime 可以创建多个 Context，Context 之间可以相互访问。

  - 之所以这样设计，是因为浏览器中有 iframe，如果没有 Context，每次创建一个 iframe，就需要起一个引擎，这是很浪费的。而引入 Context 可以避免创建多个引擎的情况。

- 初始化 Context 内的对象和属性。会初始化各类内建对象和其原型方法，例如 Array、Boolean、String 等。

- 通过 Eval 方法执行代码

在 jsscript 中，大部分流程还是一致的，只不过我们将最后 Eval 的过程拆分成了先编译后运行的过程

## 数据结构

在 QuickJS 中，所有的 JS 的值都会用一个叫做 JSValue 的结构体表示，它不和任何 Context 或者 Value 绑定，是一个独立的存在，具体的结构体定义这里就不再详细解释。而在 jsscript 中，自然也是沿用了一样的设定，唯一的不同是采用了 TypeScript 的 Tagged Union 而非 C 中的 union，并且采用了更加适合前端的命名规则。

```typescript
export type JSSaftHostValue = JSNumberValue | JSBoolValue | JSStringValue | JSUndefinedValue | JSNullValue
export type JSHostValue = JSSaftHostValue | JSSymbolValue
export type JSInstrinsicValue = JSHostValue | JSObjectValue | JSSymbolValue
export type JSValue = JSInstrinsicValue | JSExpectionValue | JSTryContextValue
```

这里的细节可能会有些多，比如：

- `null` 和对象其实是用不同的 tag 表示，虽然 typeof 这两者都返回的是 `"object"`，但在引擎层面是不一样的

- 所有的 Object 都是使用 JSObjectValue 所表示，不论是普通对象还是函数。当然，在 JSObjectValue 内也会有具体对象类型的细分，但这不在 JSValue 这个层面所讨论的内容。

## 错误处理

在 QuickJS 中，错误本身和 JS 内的实现是不同的，引擎将错误状态和错误内容拆分成了两部分：

- 错误状态会通过一个特殊的 JSValue 实现，在 jsscript 内叫做 JSExceptionValue。

- 错误内容则会直接存储在 runtime 内，也就是说每次运行完想去拿错误信息的时候，需要去 runtime 上拿，而不是直接从返回的 value 中获取。

所以在引擎的实现过程中，如果你想表示某个过程发生了错误，只需要：

- 创建错误对象，并存储到 runtime 中

- 返回 JSExceptionValue，告知调用者，这里有错误

所以，当我们尝试调用一个函数的时候，都需要先检查返回值是否为错误，虽然这很麻烦，但这是必要的做法。（Golang 开发者是不是很眼熟，捂脸）

```typescript
function JSDiv(ctx, leftVal, rightVal) {
	const left = JSToNumber(ctx, leftVal)
	if (isExceptionValue(left)) {
		// 检查错误，如果出错了，就直接返回就好
		return left
	}
	const right = JSToNumber(ctx, rightVal)
	if (isExceptionValue(right)) {
		return right
	}
	return createNumberValue(left.value - right.value)
}
```

## 更多

更多内容可以看源码，包括如何创建值、新增属性、函数调用等。

进入 [https://github.com/XGHeaven/jsscript/tree/main/src](https://github.com/XGHeaven/jsscript/tree/main/src) 文件夹之后，可以按照入口（Runtime）的方式阅读，也可以按照文件命名的方式，找寻自己好奇的那部分点进去看即可。

# CLI

最简单的体验的方式，就是安装 CLI

```bash
# 全局安装
npm install @xgheaven/jsscript -g

# 运行脚本
jsscript run file.js
```

```javascript
// script.js
const fn = () => {
	console.log(1 + 1)
}
fn()
```

不过目前还有些问题还没有处理：

- 不支持 REPL

- 不支持模块，只能运行单一脚本

- 部分 API 缺失，不确保能够运行所有脚本

# API

> 目前 API 的定义都处于 unstable 状态，预计后续会大改，目前仅限于了解和学习即可，请勿在生产环境使用。

## 基本使用

```javascript
import { Runtime, Features, parseScript, parseBytecode, toHostValue } from '@xgheaven/jsscript'

const runtime = new Runtime({
  features: [
	  // 注入所有在 ECMA262 中定义的方法
    new Features.ECMA262Feature(),
    // 注入和系统相关，例如 setTimeout 等
    new Features.OsFeature(),
  ],
})

const context = runtime.newContext()

const script = `<your-script>`;

// 直接解析成函数
const fn = parseScript(context, script)
// 或者分成两步，先解析为字节码，然后再将字节码解析成函数。
// 字节码是可序列化的，你可以将其 stringify 之后存储下来，方便下次直接使用
const bc = compileToBytecode(script)
const fn = parseBytecode(context, bc)

// 运行刚才生成的函数
const ret = context.run(fn)

// 返回值是 vm 内的值，需要通过 toHostValue 转换成 JS 可识别的对象
console.log(toHostValue(ret))
```

## Feature

Feature 是灵活性的根本，vm 内的各种行为和功能，都可以通过 Feature 的方式进行组合和定制。

目前提供以下几种：

- `ECMA262Feature` 提供 ECMA262 规范中提供的对象，例如 Array/Boolean/String 等构造函数和其原型方法。如果不引用这个，VM 环境内将不会有这些构造函数和相关的原型方法，但是并不影响其字面量的使用。

- `JobSchedulerFeature` 用于提供 Promise 的任务调度，如果代码不曾使用 Promise，则无需引用。当然，你也可以定义自己的任务调度方法

- `BrowserFeature` 用于一定程度上模拟浏览器的环境，例如 window 对象

- `OsFeature` 提供和系统交互的一些方法，例如 setTimeout 等

除了以上几种，也可以自定义 Feature：

```javascript
import { Feature, createNumberValue } from '@xgheaven/jsscript'

class DemoFeature extends Feature {
	initContext(ctx) {
		// Context 初始化回调，你可以注入任何你想要的东西
		// 在 VM 内的全局对象中注册一个 xxx 的全局属性
		ctx.defineGlobalValue('xxx', createNumberValue(1))
	}
	
	initRuntime(rt) {
		// Runtime 初始化回调
	}
}

const runtime = new Runtime({ features: [new DemoFeature] })
```

# 心里话

其实吧，这个项目主要还是以个人学习目的为准，目前没有准确的实用目标。如果你看完之后觉得一般般，我完全表示理解，因为本身就没有特别出众的功能和能力。

但如果你也对 JSVM 感兴趣，又奈何很难、没时间直接学习 QuickJS/V8，可以尝试来一起来学习和实现。
