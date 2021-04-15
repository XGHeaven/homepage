---
title: 尝鲜用 React Hook + Parcel 构建真心话大冒险简单页面
date: 2018-12-26 09:52:47
category: React
tags:
  - React
  - React Hook
  - Parcel
---

> **阅读推荐**：本人需要您有一定的 React 基础，并且想**简单**了解一下 Hook 的工作方式和注意点。但是并不详细介绍 React Hook，如果想有进一步的了解，可以查看官方文档。因为项目比较简单，所以我会比较详细的写出大部分代码。建议阅读文章之前请先阅读目录找到您关注的章节。

<!-- TOC -->

# React Hook + Parcel

几天前，我女票和我说他们新人培训需要一个《真心话大冒险》的界面，想让我帮她写一个。我说好呀，正好想到最近的 React Hook 还没有玩过，赶紧来试试，于是花了一个晚上的时间，其实是俩小时，一个小时搭建项目，一个小时写。

Demo: [http://souche-truth-or-dare.surge.sh](http://souche-truth-or-dare.surge.sh) (因为女票是大搜车的)

{% asset_img demo.gif %}

### 环境搭建

首先我们创建一个文件夹，做好初始化操作。

```bash
mkdir truth-or-dare
cd truth-or-dare
npm init -y
```

安装好依赖，`react@next` `react-dom@next` `parcel-bundler` `emotion@9` `react-emotion@9` `babel-plugin-emotion@9`。

> React Hook 截止发稿前（2018-12-26）还处于测试阶段，需要使用 `next` 版本。
>
> `emotion` 是一个比较完备的 css-in-js 的解决方案，对于我们这个项目来讲是非常方便合适的。另外因为 emotion@10 的最新版本对 `parcel` 还有一定的兼容性问题，见 [issue](https://github.com/parcel-bundler/parcel/issues/2237)。所以这里暂时使用 `emotion@9` 的旧版本。

```bash
npm i react@next react-dom@next emotion@9 react-emotion@9
npm i parcel-bundler babel-plugin-emotion@9 -D
```

创建 `.babelrc` 文件或者在 `package.json` 中写入 Babel 配置：

```json
{
  "plugin": [
    ["emotion", {"sourceMap": true}]
  ]
}
```

创建 `src` 文件夹，并创建 `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>真心话大冒险</title>
</head>
<body>
  <div id="app"></div>
  <script src="./index.jsx"></script>
</body>
</html>
```

和 `index.jsx` 文件

```jsx
import * as React from 'react'
import { render } from 'react-dom'

render(<div>First Render</div>, document.getElementById('app'))
```

最后添加如下 `scripts` 到 `package.json` 中

```json
{
  "start": "parcel serve src/index.html",
  "build": "rm -rf ./dist && parcel build src/index.html"
}
```

最后我们就可以 `npm start` 就可以成功启动开发服务器了。在浏览器中打开 `localhost:1234` 即可。

`parcel` 已经内建了 Hot Reload，所以不需要进行额外的配置，开箱即用。是不是觉得非常简单，有了它，手动搭建项目不再困难。当然了，TS 也是开箱即用的，不过这次我这个项目真的很小，就不用 TS 了。

### useState 第一个接触的 Hook

我们创建一个 `App.jsx` 开始我们真正的编码。先简单来看一下

```jsx
export default function App() {
  const [selected, setSelected] = useState('*')
  const [started, setStarted] = useState(false)

  return (
    <div>
      <div>{selected}</div>
      <button>{started ? '结束' : '开始'}</button>
    </div>
  )
}
```

我们就完成了对 Hook 最简单的使用，当然了现在还没有任何交互效果，也许你并不明白这段代码有任何用处。

简单讲解一下 useState，这个函数接受一个参数，为初始值，可以是任意类型。它会返回一个 `[any, (v: any) => void]` 的元组。其中第一个 State 的值，另一个是一个 Setter，用于对 State 设置值。

这个 Setter 我们如何使用呢？只需要在需要的地方调用他就可以了。

```jsx
<button onClick={() => setStarted(!started)}>{started ? '结束' : '开始'}</button>
```

保存，去页面点击一下这个按钮看看，是不是发现他会在 `结束` 和 `开始` 之间切换？Setter 就是这么用，非常简单，如果用传统的 Class Component 来理解的话，就是调用了 `this.setState({started: !this.state.started})` 。不过和 setState 不同的是，Hook 里面的所有数据比较都是 `===`（严格等于）。

useState 还有很多用法，比如说 Setter 支持接收一个函数，用于传入之前的值以及返回更新之后的值。

### useEffect 监听开始和结束事件

接下来，我们想要点击开始之后，屏幕上一直滚动，直到我点击结束。

如果这个需求使用 Class Component 来实现的话，是这样的：

1. 监听按钮点击事件
2. 判断是开始还是结束
   - 如果是开始，那么就创建一个定时器，定时从数据当中随机获取一条真心话或大冒险并更新 `selected`
   - 如果是结束，那么就删除之前设置的定时器

非常直接，简单粗暴。

用了 Hook 之后，当然也可以这样做了，不过你还需要额外引入一个 State 来存储 timer，因为函数组件无法持有变量。但是如果我们换一种思路：

1. 监听 `started` 变化
   - 如果是开始，那么创建一个定时器，做更新操作
   - 如果是结束，那么删除定时器

好像突然变简单了，让我们想象这个用 Class Component 怎么实现呢？

```jsx
export default class App extends React.Component {
  componentDidUpdate(_, preState) {
    if (this.state.started !== preState.started) {
      if (this.state.started) {
        this.timer = setInterval(/* blahblah*/)
      } else {
        clearInterval(this.timer)
      }
    }
  }

  render() {
    // blahblah
  }
}
```

好麻烦，而且逻辑比较绕，而且如果 componentDidUpdate 与 render 之间有非常多的代码的时候，就更难对代码进行分析和阅读了，如果你后面维护这样的代码，你会哭的。可是用 useEffect Hook 就不一样了。画风如下：

```jsx
export default function App() {
  // 之前的代码

  // 当 started 变化的时候，调用传进去的回调
  useEffect(() => {
    if (started) {
      const timer = setInterval(() => {
        setSelected(chooseOne())
      }, 60)

      return () => clearInterval(timer)
    }
  }, [started])

  return (
    // 返回的 View
  )
}
```

当用了 React Hook 之后，所有的逻辑都在一起了，代码清晰且便于阅读。

useEffect 从字面意义上来讲，就是可能会产生影响的一部分代码，有些地方也说做成副作用，其实都是没有问题的。但是副作用会个人一种感觉就是这段代码是主动执行的而不是被动执行的，不太好理解。我觉得更好的解释就是受到环境（State）变化影响而执行的代码。

为什么这么理解呢？你可以看到 useEffect 还有第二个参数，是一个数组，React 会检查这个数组这次渲染调用和上次渲染调用（因为一个组件内可能会有多次 useEffect 调用，所以这里加入了**渲染**限定词）里面的每一项和之前的是否变化，如果有一项发生了变化，那么就调用回调。

当理解了这个流程之后，或许你就能理解为什么我这么说。

当然了，第二个参数是可以省略的，省略之后就相当于默认监听了全部的 State。（现在你可以这么理解，但是当你进一步深入之后，你会发现不仅仅有 State，还有 Context 以及一些其他可能触发状态变化的 Hook，本文不再深入探究）

到现在，我们再来回顾一下关于定时器的流程，先看一下代码：

```jsx
if (started) {
  const timer = setInterval(() => {
    setSelected(chooseOne())
  }, 60)

  return () => clearInterval(timer)
}
```

理想的流程是这样的：

- 如果开始，那么注册定时器。——Done!
- 如果是结束，那么取消定时器。——Where?

咦，`else` 的分支去哪里了？为啥在第一个分支返回了取消定时器的函数？

这就牵扯到 useEffect 的第二个特性了，他不仅仅支持做正向处理，也支持做反向清除工作。你可以返回一个函数作为清理函数，当 effect 被调用的时候，他会先调用上次 effect 返回的清除函数（可以理解成析构），然后再调用这次的 effect 函数。

于是我们轻松利用这个特性，可以在只有一条分支的情况下实现原先需要两条分支的功能。

### 其他 Hook

在 Hook 中，上面两个是使用非常频繁的，当然还有其他的比如说 `useContext`/`useReducer`/`useCallback`/`useMemo`/`useRef`/`useImperativeMethods`/`useLayoutEffect`。

你可以创建自己的 Hook，在这里 React 遵循了一个约定，就是所有的 Hook 都要以 `use` 开头。为了 ESLint 可以更好对代码进行 lint。

这些都属于高级使用，感兴趣的可以去研究一下，本片文章只是入门，不再过多讲解。

### 我们来用 Emotion 加点样式

css-in-js 大法好，来一顿 Duang, Duang, Duang 的特技就好了，代码略过。

### 收尾

重新修改 `src/index.jsx` 文件，将 `<div/>` 修改为 `<App/>` 即可。

最后的 `src/App.jsx` 文件如下：

```jsx
import React, { useState, useEffect } from 'react'
import styled from 'react-emotion'

const lists = [
  '说出自己的5个缺点',
  '绕场两周',
  '拍一张自拍放实习生群里',
  '成功3个你说我猜',
  '记住10个在场小伙伴的名字',
  '大声说出自己的名字“我是xxx”3遍',
  '拍两张自拍放实习生群里',
  '选择另一位小伙伴继续游戏',
  '直接通过',
  '介绍左右两个小伙伴',
]

function chooseOne(selected) {
  let n = ''
  do {
    n = lists[Math.floor(Math.random() * lists.length)]
  } while( n === selected)
  return n
}

const Root = styled.div`
  background: #FF4C19;
  height: 100vh;
  width: 100vw;
  text-align: center;
`

const Title = styled.div`
  height: 50%;
  font-size: 18vh;
  text-align: center;
  color: white;
  padding: 0 10vw;
  font-family:"Microsoft YaHei",Arial,Helvetica,sans-serif,"宋体";
`

const Button = styled.button`
  outline: none;
  border: 2px solid white;
  border-radius: 100px;
  min-width: 120px;
  width: 30%;
  text-align: center;
  font-size: 12vh;
  line-height: 20vh;
  margin-top: 15vh;
  color: #FF4C19;
  cursor: pointer;
`

export default function App() {
  const [selected, setSelected] = useState('-')
  const [started, setStarted] = useState(false)

  function onClick() {
    setStarted(!started)
  }

  useEffect(() => {
    if (started) {
      const timer = setInterval(() => {
        setSelected(chooseOne(selected))
      }, 60)

      return () => clearInterval(timer)
    }
  }, [started])

  return (
    <Root>
      <Title>{selected}</Title>
      <Button onClick={onClick}>{started ? '结束' : '开始'}</Button>
    </Root>
  )
}

```

### 总结复盘 —— 性能问题？

最近刚刚转正答辩，突然发现**复盘**这个词还挺好用的，哈哈哈。

虽然这么短时间的使用，还是有一些自己的思考，说出来供大家参考一下。

如果你仔细思考一下会发现，当使用 useEffect 的时候，其实每次都是创建了一个新的函数，但并不是说每次都会调用这个函数。如果你代码里面 useEffect 使用的很多，而且代码还比较长，每次渲染都会带来比较大的性能问题。

所以解决这个问题有两个思路：

1. 不要在 Hook 中做太多的逻辑，比如说可以让 Hook 编写一些简单的展示组件，比如 Tag/Button/Loading 等，逻辑不复杂，代码量小，通过 Hook 写在一起可以降低整个组件的复杂度。

2. 将 Effect 拆分出去，并通过参数传入。类似于这个样子
   ```jsx
   function someEffect(var1, var2) {
       // doSomething
   }

   export function App() {
   	// useState...
       useEffect(() => someEffect(var1, var2), [someVar])
       // return ....
   }
   ```
   虽然这也是创建了一个函数，但是这个函数创建的速度和创建一个几十行几百行的逻辑的函数相比，确实快了不少。其次不建议使用 `.bind` 方法，他的执行效率并没有这种函数字面量快。

   这种方式不建议手动来做，可以交给 babel 插件做这部分的优化工作。

其实作为一个开发者来说，不应该太多的关注这部分，但是性能就是程序员的 XX 点，我还是会下意识从性能的角度来思考。这里只是提出了一点小小的优化方向，希望以后 React 官方也可以进一步做这部分的优化工作。

已经有的优化方案，可以查看官方 [FAQ](https://reactjs.org/docs/hooks-faq.html#performance-optimizations)

### 总结

经过这个简短的使用，感觉用了 Hook 你可以将更多的精力放在逻辑的编写上，而不是数据流的流动上。对于一些轻组件来说简直是再合适不过了，希望早点能够正式发布正式使用上吧。

另外 `parcel` 提供了强大的内置功能，让我们有着堪比 `webpack` 的灵活度却有着比 `webpack` 高效的开发速度。

好的，一篇 1 小时写代码，1 天写文章的水文写完了。以后如果有机会再深入尝试。
