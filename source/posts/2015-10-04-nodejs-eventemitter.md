---
title: Nodejs EventEmitter 解读
date: 2015-10-04 00:25:46
categories: Node.js
tags: [node.js, EventEmitter]
---

<!-- toc -->

# `events` moudle

先说一下网上似乎很多人提供的使用例子来看，都是如下的
```javascript
var EventEmitter = require('events').EventEmitter;
```
然而在源码当中有这样的一句话
{% code 模块定义 lang:js https://github.com/nodejs/node/blob/master/lib/events.js#L8 events.js:8%}
module.exports = EventEmitter;
EventEmitter.EventEmitter = EventEmitter;
{% endcode %}

所以`require('events').EventEmitter`和`require('events')`是一样的。所以以后大家可以直接写

```javascript
var EventEmitter = require('events');
```

# Class EventEmitter

在源码中，构造函数极其的简单。

{% code constructor lang:js https://github.com/nodejs/node/blob/master/lib/events.js#L5 event.js:5%}
	function EventEmitter() {
		EventEmitter.init.call(this);
	}
{% endcode %}

思路很简单，就是直接调用`EventEmitter`上的静态方法`init`进行构造。之后我们会介绍`EventEmitter.init`方法

## EventEmitter Static Method And Property

挂在到EventEmitter上的静态属性和方法还是很多的，先说明一下静态属性：
- defaultMaxListeners
- usingDomains

### defaultMaxListeners
顾名思义，默认的最大callback数量，就是如果当前对象没有指定`_maxListeners`，默认使用的就是这个值，默认是10
更多请看[_maxListeners](#_maxListeners)

### usingDomains
待定


### init()

{% code EventEmitter.init lang:js https://github.com/nodejs/node/blob/master/lib/events.js#L23 events.js:23%}
EventEmitter.init = function() {
  this.domain = null;
  if (EventEmitter.usingDomains) {
    // if there is an active domain, then attach to it.
    domain = domain || require('domain');
    if (domain.active && !(this instanceof domain.Domain)) {
      this.domain = domain.active;
    }
  }

  if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
    this._events = {};
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};
{% endcode %}

先不管`domain`恨死干什么用的，总之`init`函数给`this`挂上了以下四个属性：
- domain
- [_events](#_events)
- [_eventsCount](#_eventsCount)
- [_maxListeners](#_maxListeners)

### listenerCount(emitter, type)
获取`emitter`中指定类型的callback数量

这里有一个比较特殊的地方，就是他对对象是否含有`listenerCount`方法进行了判断
{% code listenerCount lang:js https://github.com/nodejs/node/blob/master/lib/events.js#L397 events.js:397%}
EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};
{% endcode %}

##### 疑问：为什么要判断原型上是否含有`listenerCount`方法呢？



## EventEmitter Property

### _events
这个属性是一个事件的缓存列表，他的`key`就是事件名称，`value`就是事件的回调函数，有如下几种取值：
- Function
- Array
当只有一个回调函数的时候，就直接存储为回调函数本身，否则包装成数组进行存储

### _eventsCount
顾名思义，就是事件的个数，这里有几个需要注意的就是，这个之有且仅在添加一个没有过的事件的时候才会加一，如果你给一个事件添加了多了callback的话，这个值并不会加一的。

### _maxListeners
这个就是可以表示一个event的最大callback的个数。如果小于等于这个个数，不会产生任何问题。但是如果大于这个限制，将会弹出警告，说可能会导致内存泄露。
我猜测可能是因为过多的callback会保存过多的context，从而导致内存泄露。
敬请更正

## EventEmitter Method

先从最常用的讲起，就是添加事件侦听喽

### addListener() = on()
首先大家一定很熟悉`on`方法，大家一定想不到的是，竟然还有一个叫`addListener`方法。那么这两个方法有什么区别呢？
答案就是什么区别都木有~

而且在定义的时候，定义的是`addListener`而不是`on`，从源码中便可以看出来

{% code addListener lang:js https://github.com/nodejs/node/blob/master/lib/events.js#L191 events.js:191 %}
EventEmitter.prototype.addListener = function addListener(type, listener) {
  var m;
  var events;
  var existing;
  // .... 此处省略10000行
}
// 就是这里，大家看到了么~~
EventEmitter.prototype.on = EventEmitter.prototype.addListener;
{% endcode %}

所以`on`更多的是一种简化，而正统的却是`addListener`，但是虽然这个正统，相信也没有几个人来使用吧，毕竟实在是太那啥了，是吧-_-||

好的下面言归正传，整个添加函数的流程可以看做是这样的（大家可以对照的源码看，我就不在这里把源码全部都粘贴过来了，并且我这里可能为了语句的通顺改变部分代码的执行顺序，大家请自行看出来。。。）：
1. 接受两个参数，分别是`type`表示事件，就是event，第二个是`listener`，侦听器，也就是callback
2. 如果`listener`不是函数，很明显啊，抛出错误不解释
3. 检测当前对象上是否存在`_events`属性，如果不存在创建之，并顺手初始化`_eventsCount`为0.
4. 另`events`为`this._events`
5. 如果`events`中没有`type`的`listener`，那么不解释，添加之~即`events[type] = listener`
6. 如果`events`里面有的话，不解释，一个就数组包装一下，两个直接push
7. 如果`type`类型的`listener`超过两个了，那么就检测一下有没有超过长度限制，具体的检测逻辑我就不在这里详细的说明了，总之就是给将检测结果挂到`events[type]`的`warned`属性上了。
8. 如果有对应的`newListener`事件侦听的话，就直接用`type`和`listener.listener?listener.listener:listener`触发之
8. 返回`this`

至此函数执行完毕

那么下一个就讲一下如果触发事件吧

#### `newListener`事件是在事件真正添加之前触发的

### emit()
很早以前我认为`emit`只能`emit`一个参数，到现在我猜明白，想几个就几个，没人限制你。

`emit`有一个很好玩的特性就是，如果你`emit`一个`"error"`，如果没有事件侦听这个error的话，就会直接throw出一个error来，而其他的事件不会又这种效果，这就意味着我们最好要侦听`error`事件，万一出了一点错误，那将是崩溃的节奏啊~

源码在[events.js:117](https://github.com/nodejs/node/blob/master/lib/events.js#L117)

1. 检测`type`是否为`"error"`
2. 如果是，并且没有监听到`error`，throw出pass进来的错误或者构建一个未捕捉的错误弹出。
3. 如果没有对应的回调函数的话，返回`false`
3. 获取构造函数并赋值给`handler`，这个值有可能是函数，或者是数组。
4. 根据参数个数调用对应的函数，顺序依次运行`handler`
5. 返回`true`

#### `handler`的执行
在`handler`执行的时候，会先将当前队列复制一份，然后再进行执行。并且根据参数个数用call或者apply执行函数。放置在某一次执行期间突然掺入了其他的callback或者删除了callback，从而引发错误。

我原本以为会使用`process.nextTick`进行异步的执行，后来一想不对啊，肯定要按照添加的顺序进行执行，所以依次调用。

#### 根据参数个数进行加速
见
{% code fastToRun lang:js https://github.com/nodejs/node/blob/master/lib/events.js#L65 events.js:65%}
// 没有参数的调用
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
// 一个参数
function emitOne(handler, isFn, self) {
  // ...... 此处继续省略10000行
}
// 两个参数
function emitTwo(handler, isFn, self) {
  // ...... 此处继续省略10000行
}
// 三个参数
function emitThree(handler, isFn, self) {
  // ...... 此处继续省略10000行
}
// 不定参数
function emitMore(handler, isFn, self) {
  // ...... 此处继续省略10000行
}
{% endcode %}

源码对不同的情况进行了加速，因为人们大部分情况都是使用0参数或者1参数的，所以对这几种情况进行处理是非常高效的。

### once()
这个最简单了，就是用一个函数封装一下传入的callback，然后将这个函数，`addListener`进入到事件中。关于这个封装函数的写法，如下
{% code g() lang:js https://github.com/nodejs/node/blob/master/lib/events.js#L253 events.js:253%}
var fired = false;
function g() {
  this.removeListener(type, g);

  if (!fired) {
    fired = true;
    listener.apply(this, arguments);
  }
}
g.listener = listener;
// 挂载原先的callback，用于remove的时候比较使用
{% endcode %}

具体的就不多说了，总之就是执行后，先删除这个包装过的callback。

##### 我的疑问：这里我有一点不太理解的地方就是为什么还需要`fired`进行标记一下呢？

### removeListener(type, listener)
删除指定类型的指定callback的事件
很简单，分为一下几步
1. 如果`listener`不是函数，抛出错误
2. 如果`events`不存在或者对应的事件不存在，返回`this`
3. 另`list`为`events[type]`
4. 如果`list`就是那个callback或者`list.listener`是那个callback，删除
5. 否则如果这是一个数组，那么找到对应的`listener`删除，否则返回`this`
6. 如果上面有任意一个删除之后`_eventsCount`为0了，直接重新赋值`this._events = {}`（其实并不知道这个意义何在）
7. 如果有任何一个删除，并且有事件侦听到了`removeListener`，触发之，传递`type`和`listener`
8. 返回`this`

#### 在事件删除之后才调用`removeListener`事件


### removeAllListeners(type)
根据传递的参数来决定是删除全部的还是只删除指定事件的全部

1. 确保存在`this._events`，否则返回`this`
2. 如果没有侦听`removeListener`
	- 如果没有传递`type`，重新赋值`this._events`和`this._eventsCount`
	- 如果传递了`type`，删除`type`对应的事件，根据情况重新赋值~~~
3. 如果侦听了`removeListener`，除了这个本身，依次调用`removeAllLiseners()`进行删除，最后删除`removeListener`这个事件
5. 对于每一个callback，依次调用`removeListener`方法进行删除
6. 返回`this`

### listeners(type)
获取指定类型的callback，否则为`[]`

### listenerCount(type)
获取指定类型的callback的数量

# TODO
## domain 部分没有进行解释
