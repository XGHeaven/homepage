---
title: "【后知后觉系列】css position: sticky 属性以及某些场景的使用"
date: 2018-11-18 22:03:41
category: 后知后觉
tags: [CSS]

---



> 不知何时，曾经我们认为的东西便会被打破，如果我们不坚持着去学习，那么我们终将会被社会所淘汰。于是我决定写《后知后觉系列》来记录一下我曾经跟不上的知识和关键点，内容不一定复杂，内容含量不一定高，也许别人已经写过一个一样的教程了，但是希望你能从我的笔记中获取你认为重要的东西，在纷繁复杂的工作中留下一个真正极客的世界，希望某一天这些东西都能够运用到工作当中。——XGHeaven

> 记得先看一下目录，找到你喜欢好奇的内容去针对性阅读，毕竟我不是来写教程的。

<!-- TOC -->



# position: sticky 这究竟是一个什么鬼？



最近公司在用 Regular 封装一个表格组件，需要实现固定表头的功能。这个是几乎所有的组件库都会实现的一个效果，所以实现方式有很多种：



1. 因为 thead/tr 的 position 属性是无效的，所以需要单独用 div 创建一个表头。然后设置这个表头的 `position: absolute`，同时 `top: 0`。同时这种模式下，需要用户指定每一列的宽度，保证自制的表头和下面原生的表格一一对应起来。如果不指定的话，也可以等待 dom 渲染完成之后，再测量宽度。比如 Ant Design 就是使用的这种方式。
2. 因为上面那种方案的难点在于无法很好的保证自制表头和原生表格宽度的一致性，所以我们组的大佬提出了使用原生 thead，监听 scroll 事件，设置 `transform` 属性使得表头进行偏移，从而实现 fixHeader 的问题，这种方式解决了第一个的问题，但是需要手动监听 scroll 事件，在快速滚动的情况下，可能会有一定的性能问题。而且不够优雅。如果后面的表格内容中有 `position: relative` 的元素，会覆盖到表头。

不管是哪种方式，我总感觉不是很完美，于是我就在思考，除了手动更新的方式，难道就没有一些比较好的方式去做。然后我就去翻看了 github 的固定表头的方式，顿时豁然开朗。于是就延伸出了这篇文章，`position: sticky` 属性。



**Pay Attention**：后面所讲的内容就不怎么和表格固定表头相关，如果你对表格固定表头或者固定列有一定问题，可以查看网易考拉的这篇文章 [《一起来聊聊table组件的固定列》](https://blog.kaolafed.com/2017/12/25/一起来聊聊table组件的固定列/)。



当第一眼看到这个熟悉的时候，第一句话就是“我 CA”，这 TMD 是什么鬼属性，position 什么时候有了这个属性。于是去看了 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position) 的介绍，可以理解为，这个属性是**实现固定顶部最简单的实现方式**。

他其实是一种 `position:relative` 和  `position: fixed` 的结合体，一定要配合 `top/right/bottom/left` 的属性一起才有作用，设置对应方向的最小值。当大于最小值的时候，他就像 `relative` 一样，作为文档流的一部分，并且 `top/right/bottom/left` 属性也会失效。否则当小于设置的值的时候表现的像 `fixed`，只不过这个 `fixed` 不再现对于窗口，而是相对于最近的可滚动块级元素。

如果你看过其他关于 sticky 的文章，大部分都会以黏贴的意思来解释他，那么很明显，确实也是这个意思，如果你觉得看了其他教程能够清楚的话，那么可以不用看我这篇了，如果你没看懂的话，可以来我这里看看。

废话少说，我们先来看一下如何正确使用 sticky。



## 正确的使用姿势

> 以下的代码预览请使用最新 Chrome 查看，或者支持 `position: sticky` 的浏览器查看。部分网站不支持 iframe，可以去我的 Blog 查看

1. `position: sticky` 只相对于第一个有滚动的父级块元素（scrolling mechanism，通过 overflow 设置为 `overflow/scroll/auto/overlay` 的元素），而不是父级块元素。

   <iframe height='265' scrolling='no' title='position sticky 相对于最外面的可滚动父级' src='//codepen.io/xgheaven/embed/preview/zMjPRL/?height=265&theme-id=dark&default-tab=css,result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/xgheaven/pen/zMjPRL/'>position sticky 相对于最外面的可滚动父级</a> by Bradley Xu (<a href='https://codepen.io/xgheaven'>@xgheaven</a>) on <a href='https://codepen.io'>CodePen</a>.
   </iframe>

2. `position: sticky` 只有当设置对应的方向(top/right/bottom/left)，才会有作用，并且可以互相叠加，可以同时设置四个方向。

3. 即使设置了 `position: sticky`，也只能显示在父级块元素的内容区域，他无法超出这个区域，除非你设置了负数的值。

4. `position: sticky` 并不会触发 BFC，简单来讲就是计算高度的时候不会计算 float 元素。

5. 当设置了 `position: sticky` 之后，内部的定位会相对于这个元素

   <iframe height='265' scrolling='no' title='position sticky 内部绝对定位相对于这个元素' src='//codepen.io/xgheaven/embed/preview/qQKbJO/?height=265&theme-id=dark&default-tab=css,result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/xgheaven/pen/qQKbJO/'>position sticky 内部绝对定位相对于这个元素</a> by Bradley Xu (<a href='https://codepen.io/xgheaven'>@xgheaven</a>) on <a href='https://codepen.io'>CodePen</a>.
   </iframe>

6. 虽然 `position: sticky` 表现的像 `relative`  或者 `fixed`，所以也是可以通过 `z-index` 设置他们的层级。当这个元素的后面的兄弟节点会覆盖这个元素的时候，可以通过 `z-index` 调节层级。

   <p data-height="265" data-theme-id="dark" data-slug-hash="LXodKa" data-default-tab="css,result" data-user="xgheaven" data-pen-title="position: sticky 通过 z-index 调节层级" data-preview="true" class="codepen">See the Pen <a href="https://codepen.io/xgheaven/pen/LXodKa/">position: sticky 通过 z-index 调节层级</a> by Bradley Xu (<a href="https://codepen.io/xgheaven">@xgheaven</a>) on <a href="https://codepen.io">CodePen</a>.</p>
   <script async src="https://static.codepen.io/assets/embed/ei.js"></script>

当你懂了这几个之后，其实这个属性就用起来就很简单了。



## 举个栗子 - 通讯录列表头部

no code no bb，直接上代码。

<iframe height='265' scrolling='no' title='position sticky 通讯录 Demo' src='//codepen.io/xgheaven/embed/preview/RqyYvZ/?height=265&theme-id=dark&default-tab=html,result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/xgheaven/pen/RqyYvZ/'>position sticky 通讯录 Demo</a> by Bradley Xu (<a href='https://codepen.io/xgheaven'>@xgheaven</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## 拓展思考

### 如何检测是否已经被固定？

最常见的需求就是，当还在文档流当中的时候，正常显示，但是当固定住的时候，添加一些阴影或者修改高度等操作。要想实现这个效果，第一反应可能就是手动监听 `scroll` 事件，判断位置，这当然是没有问题的，但是随之而来的确实性能的损耗。

最好的方式是使用 IntersectionObserver，这是一个可以监听一个元素是否显示在视窗之内的 API，具体内容见阮老师的[《IntersectionObserver API 使用教程》](http://www.ruanyifeng.com/blog/2016/11/intersectionobserver_api.html)。基本原理就是在一段滚动的头部和尾部分别添加两个岗哨，然后通过判断这两个岗哨的出现和消失的时机，来判断元素是否已经被固定。

例子[详见此处](https://ebidel.github.io/demos/sticky-position-event.html)

### 那能不能实现表格头/列固定呢？

~~理想很丰满，显示很骨感，因为 thead/tbody 对 position 无爱，所以也就不支持 sticky 属性，所以我们还是要单独创建一个头部。~~

后来经过网友提醒，自己又去研究了一下，发现还是有办法做到固定表头和列的。

首先针对 Firefox，它本身就支持 thead/tbody 的 position 属性，所以可以直接通过对 thead/tbody 设置 position 来实现。而对于 Chrome 浏览器来讲，可以通过设置 thead 内的 th 来实现。具体见 Demo.

<p data-height="265" data-theme-id="dark" data-slug-hash="RqmMQm" data-default-tab="html,result" data-user="xgheaven" data-pen-title="position sticky 通过设置 td 来实现固定表头" data-preview="true" class="codepen">See the Pen <a href="https://codepen.io/xgheaven/pen/RqmMQm/">position sticky 通过设置 td 来实现固定表头</a> by Bradley Xu (<a href="https://codepen.io/xgheaven">@xgheaven</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>


**然后好像就没有了**，谢谢观看水水的《后知后觉系列》
