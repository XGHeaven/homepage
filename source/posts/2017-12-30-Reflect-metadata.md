---
title: Reflect-metadata 详解
date: 2017-12-30 22:44:07
categories: Jacascript
tags:
  - Javascript
  - Reflect Metadata
---

## 引言

在 ES6 的规范当中，就已经存在 `Reflect` API 了。简单来说这个 API 的作用就是可以实现对变量操作的函数化，也就是反射。具体的关于这个 API 的内容，可以查看这个[教程](http://es6.ruanyifeng.com/#docs/reflect)

然而我们在这里讲到的，却是 `Reflect` 里面还没有的一个规范，那么就是 `Reflect Metadata`。

## Metadata

想必对于其他语言的 Coder 来说，比如说 Java 或者 C#，Metadata 是很熟悉的。最简单的莫过于通过反射来获取类属性上面的批注（在 JS 当中，也就是所谓的装饰器）。从而可以更加优雅的对代码进行控制。

而 JS 现在有[装饰器](https://github.com/tc39/proposal-decorators)，虽然现在还在 `Stage2` 阶段。但是 JS 的装饰器更多的是存在于对函数或者属性进行一些操作，比如修改他们的值，代理变量，自动绑定 this 等等功能。

> 所以，后文当中我就使用 TypeScript 来进行讲解，因为 TypeScript 已经完整的实现了装饰器。
> 虽然 Babel 也可以，但是需要各种配置，人懒，不想配置那么多。

但是却无法实现通过反射来获取究竟有哪些装饰器添加到这个类/方法上。

于是 `Reflect Metadata` 应运而生。

## Reflect Metadata

Relfect Metadata，简单来说，你可以通过装饰器来给类添加一些自定义的信息。然后通过反射将这些信息提取出来。当然你也可以通过反射来添加这些信息。 就像是下面这个例子所示。

```typescript
@Reflect.metadata('name', 'A')
class A {
  @Reflect.metadata('hello', 'world')
  public hello(): string {
    return 'hello world'
  }
}

Reflect.getMetadata('name', A) // 'A'
Reflect.getMetadata('hello', new A()) // 'world'
// 这里为什么要用 new A()，用 A 不行么？后文会讲到
```

是不是很简单，那么我简单来介绍一下~

### 概念

首先，在这里有四个概念要区分一下：

1. `Metadata Key` {Any} 后文简写 `k`。元数据的 Key，对于一个对象来说，他可以有很多元数据，每一个元数据都对应有一个 Key。一个很简单的例子就是说，你可以在一个对象上面设置一个叫做 `'name'` 的 Key 用来设置他的名字，用一个 `'created time'` 的 Key 来表示他创建的时间。这个 Key 可以是任意类型。在后面会讲到内部本质就是一个 `Map` 对象。
2. `Metadata Value` {Any} 后文简写 `v`。元数据的类型，任意类型都行。
3. `Target` {Object} 后文简写 `o`。表示要在这个对象上面添加元数据
4. `Property` {String|Symbol} 后文简写 `p`。用于设置在那个属性上面添加元数据。大家可能会想，这个是干什么用的，不是可以在对象上面添加元数据了么？其实不仅仅可以在对象上面添加元数据，甚至还可以在对象的属性上面添加元数据。其实大家可以这样理解，当你给一个对象定义元数据的时候，相当于你是默认指定了 `undefined` 作为 Property。 下面有一个例子大家可以看一下。

大家明白了上面的概念之后，我之前给的那个例子就很简单了~不用我多说了。

### 安装/使用

下面不如正题，我们怎么开始使用 `Reflect Metadata` 呢？
首先，你需要安装 `reflect-metadata` polyfill，然后引入之后就可以看到在 `Reflect` 对象下面有很多关于 Metadata 的函数了。因为这个还没有进入正式的协议，所以需要安装垫片使用。

> 啥，Reflect 是啥，一个全局变量而已。

你不需要担心这个垫片的质量，因为连 Angular 都在使用呢，你怕啥。

之后你就可以安装我上面写的示例，在 TypeScript 当中去跑了。

### 类/属性/方法 装饰器

看这个例子。

```typescript
@Reflect.metadata('name', 'A')
class A {
  @Reflect.metadata('name', 'hello')
  hello() {}
}

const objs = [A, new A, A.prototype]
const res = objs.map(obj => [
  Reflect.getMetadata('name', obj),
  Reflect.getMetadata('name', obj, 'hello'),
  Reflect.getOwnMetadata('name', obj),
  Reflect.getOwnMetadata('name', obj ,'hello')
])
// 大家猜测一下 res 的值会是多少？
```

> 想好了么？再给你 10 秒钟


> 10
> 9
> 8
> 7
> 6
> 5
> 4
> 3
> 2
> 1

res

```typescript
[
  ['A', undefined, 'A', undefined],
  [undefined, 'hello', undefined, undefined],
  [undefined, 'hello', undefined, 'hello'],
]
```

那么我来解释一下为什么回是这样的结果。

首先所有的对类的修饰，都是定义在类这个对象上面的，而所有的对类的属性或者方法的修饰，都是定义在类的原型上面的，并且以属性或者方法的 key 作为 property，这也就是为什么 `getMetadata` 会产生这样的效果了。

那么带 `Own` 的又是什么情况呢？

这就要从元数据的查找规则开始讲起了

### 原型链查找

类似于类的继承，查找元数据的方式也是通过原型链进行的。

就像是上面那个例子，我实例化了一个 `new A()`，但是我依旧可以找到他原型链上的元数据。

举个例子

```typescript
class A {
  @Reflect.metadata('name', 'hello')
  hello() {}
}

const t1 = new A()
const t2 = new A()
Reflect.defineMetadata('otherName', 'world', t2, 'hello')
Reflect.getMetadata('name', t1, 'hello') // 'hello'
Reflect.getMetadata('name', t2, 'hello') // 'hello'
Reflect.getMetadata('otherName', t2, 'hello') // 'world'

Reflect.getOwnMetadata('name', t2, 'hello') // undefined
Reflect.getOwnMetadata('otherName', t2, 'hello') // 'world'
```

### 用途

其实所有的用途都是一个目的，给对象添加额外的信息，但是不影响对象的结构。这一点很重要，当你给对象添加了一个原信息的时候，对象是不会有任何的变化的，不会多 property，也不会有的 property 被修改了。
但是可以衍生出很多其他的用途。

* Anuglar 中对特殊字段进行修饰 (Input)，从而提升代码的可读性。
* 可以让装饰器拥有真正装饰对象而不改变对象的能力。让对象拥有更多语义上的功能。

### API

```typescript
namespace Reflect {
  // 用于装饰器
  metadata(k, v): (target, property?) => void

  // 在对象上面定义元数据
  defineMetadata(k, v, o, p?): void

  // 是否存在元数据
  hasMetadata(k, o, p?): boolean
  hasOwnMetadata(k, o, p?): boolean

  // 获取元数据
  getMetadata(k, o, p?): any
  getOwnMetadata(k, o, p?): any

  // 获取所有元数据的 Key
  getMetadataKeys(o, p?): any[]
  getOwnMetadataKeys(o, p?): any[]

  // 删除元数据
  deleteMetadata(k, o, p?): boolean
}
```

> 大家可能注意到，针对某些操作，会有 `Own` 的函数。这是因为有的操作是可以通过原型链进行操作的。这个后文讲解。

## 深入 Reflect Metadata

### 实现原理

如果你去翻看官网的文档，他会和你说，所有的元数据都是存在于对象下面的 `[[Metadata]]` 属性下面。一开始我也是这样认为的，新建一个 `Symbol('Metadata')`，然后将元数据放到这个 Symbol 对应的 Property 当中。直到我看了源码才发现并不是这样。请看例子

```typescript
@Reflect.metadata('name', 'A')
class A {}

Object.getOwnPropertySymbols(A) // []
```

哈哈，并没有所谓的 Symbol，那么这些元数据都存在在哪里呢？

其实是内部的一个 WeakMap 中。他正是利用了 WeakMap 不增加引用计数的特点，将对象作为 Key，元数据集合作为 Value，存到 WeakMap 中去。

如果你认真探寻的话，你会发现其内部的数据结构其实是这样的

```typescript
WeakMap<any, Map<any, Map<any, any>>>
```

是不是超级绕，但是我们从调用的角度来思考，这就一点都不绕了。

```typescript
weakMap.get(o).get(p).get(k)
```

先根据对象获取，然后在根据属性，最后根据元数据的 Key 获取最终要的数据。

## End

因为 Reflect Metadata 实在是比较简单，这里就不多讲解了。更多内容请查看 [Spec](https://rbuckton.github.io/reflect-metadata)

## 题外话

其实看了源码之后还是挺惊讶的，按照一般的套路，很多 polyfill 会让你提供一些前置的 polyfill 之后，当前的 polyfill 才能使用。但是 `reflect-metadata` 竟然内部自己实现了很多的 polyfill 和算法。比如 Map, Set, WeakMap, UUID。最惊讶的莫过于 WeakMap 了。不是很仔细的阅读了一下，好像还是会增加引用计数。
