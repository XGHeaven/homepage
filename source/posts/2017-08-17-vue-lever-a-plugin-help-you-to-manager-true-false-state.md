---
title: vue-lever 一个使用装饰器模式的插件帮你管理 true/false 状态
date: 2017-08-17 11:01:14
categories: Vue.js
tags:
    - Frontend
    - Vue
    - vue-lever
---

> vue-lever 是一个使用装饰器模式的插件来帮你管理 true/false 状态

最近一直在写 vue 相关的东西，因为毕竟是前端，所以经常会遇到一种情况就是说，我需要维护一个 true/false 状态，比如说：当按钮点击的时候，显示加载字样，然后等加载完毕之后完成显示。

首先我们考虑出现这种情况的时候，如果我们一行一行的书写，那将是非常麻烦的。

```javascript
new Vue({
    data() {
        return { loading: false }
    }
    methods: {
        asyncAction() {
            this.loading = true
            this.$http.doing() // return a promise
                .then(() => this.loading = false)
                .catch(() => this.loading = false))
        }
    }
})
```

我们需要在每一个退出的情况下将 loading 状态设置为 false，这至少意味着你要写 3 遍，非常冗余。而且很容易忘记。

我们可以抽象出来，可以发现每当这种函数运行的时候，首先将相关的变量设置成 true，然后等待异步操作完成或者失败之后，再将变量设置回之前的值。

完成这个操作最简单的方式就是代理，在用户的函数调用之前设置相应的变量，在用户的函数调用完成之后，或者如果函数是异步操作，那么通过返回一个 promise 来表示异步操作。

既然讲到了代理模式，那么在 JS 中有很多，不过我们在这里通过一个 ES6 的新语法，装饰器。

话不多说，上代码

```javascript
import Lever from 'vue-lever'
// import others

new Vue({
    methods: {
        @Lever.Lever('loading')
        asyncAction() {
            return this.$http.doing() // return a promise
        }
    }
})
```

这个功能和上面的那段代码是一模一样的，是不是感觉用了装饰器之后就变得特别简单了呢？

不过这里有一点需要注意的是，为了方便和隔离，我将所有的变量全都放在 `levers` 这个变量下面，也就是说你需要通过 `levers.loading` 来使用，而不是 `loading`

不过现在暂时没有支持回调函数的方式，也就是你必须要返回一个 promise，否则是不行的。

其次我们这里还有手动模式，也就是如果你不想用装饰器的话，你可以通过 `this.$lever(name, value)`，来更改状态，其中 `name` 为变量名，`value` 为 true/false 值。当然这里也提供两个 alias，`this.$lever.t(name)` 和 `this.$lever.f(name)`。方便设置变量为 true/false。

还有一些其他的参数，大家可以去 [Github](https://github.com/XGHeaven/vue-lever) 网站查看。这篇文章就写到这里。
