---
title: lodash v4.0.0 简易更新日志
date: 2016-01-15 00:26:35
category: Lo-Dash
tags:
  - lodash
  - changelog
---

<!-- TOC -->

在 2016 年 1 月 12 日，Lo-Dash 迎来了半年来第一次大更新，也就是 `4.0`，这次更新了很多的内容，包括了`不兼容更新`，`方法分离`，`函数重命名`等等操作，下面我们来一一分析一下。
简单的翻译了一下官方的更新日志。

### 主要更新
 * 不再支持 `Bower` & `Component`，而是使用 `npm`，到发稿为止，已经无法在 `bower` 找到相关 Lo-Dash 的内容
 * 移除了对 [`IE6-8`](https://www.microsoft.com/en-us/WindowsForBusiness/End-of-IE-support) 的支持
 * 使用了 [`es5-shim`](https://github.com/es-shims/es5-shim) 或者 [`es6-shim`](https://github.com/es-shims/es6-shim)
 * 移除了大部分的 `thisArg` 参数

```
  var objects = [{ 'a': 1 }, { 'a': 2 }];
  var context = { 'b': 5 };

  function callback(item) {
    return item.a + this.b;
  }

  // in 3.10.1
  _.map(objects, callback, context);

  // in 4.0.0
  _.map(objects, _.bind(callback, context));
```

 * 在 `node` 中引用包的时候去除了类别的二级目录

```
  // in 3.10.1
  var chunk = require('lodash/array/chunk');

  // in 4.0.0
  var chunk = require('lodash/chunk');
```

 * 拆分出 `_.max` & `_.min` 为 [_.maxBy](https://lodash.com/docs#maxBy) & [_.minBy](https://lodash.com/docs#minBy)

 * 添加了足足 80 个方法

### 移除的方法

 * 移除了 `_.support`
 * 移除了 `_.findWhere` ，用 `_.find` 来替代(with iteratee shorthand)
 * 移除了 `_.where` ，用 `_.filter` 来替代(with iteratee shorthand)
 * 移除了 `_.pluck` ，用 `_.map` 来替代(with iteratee shorthand)

### 重命名的方法

 * 重命名 `_.first` 为 `_.head`
 * 重命名 `_.indexBy` 为 `_.keyBy`
 * 重命名 `_.invoke` 为 `_.invokeMap`
 * 重命名 `_.modArgs` 为 `_.overArgs`
 * 重命名 `_.padLeft` & `_.padRight` 为 `_.padStart` & `_.padEnd`
 * 重命名 `_.pairs` 为 `_.为Pairs`
 * 重命名 `_.rest` 为 `_.tail`
 * 重命名 `_.restParam` 为 `_.rest`
 * 重命名 `_.sortByOrder` 为 `_.orderBy`
 * 重命名 `_.trimLeft` & `_.trimRight` 为 `_.trimStart` & `_.trimEnd`
 * 重命名 `_.trunc` 为 `_.truncate`

### 分离出的方法
也就是说从原来的方法中，将部分功能分离出来，成为一个新的方法。

 * 分离出 `_.indexOf` & `_.lastIndexOf` 为 `_.sortedIndexOf` & `_.sortedLastIndexOf`
 * 分离出 `_.max` & `_.min` 为 `_.maxBy` & `_.minBy`
 * 分离出 `_.omit` & `_.pick` 为 `_.omitBy` & `_.pickBy`
 * 分离出 `_.sample` 为 `_.sampleSize`
 * 分离出 `_.sortedIndex` 为 `_.sortedIndexBy`
 * 分离出 `_.sortedLastIndex` 为 `_.sortedLastIndexBy`
 * 分离出 `_.uniq` 为 `_.sortedUniq`, `_.sortedUniqBy`, & `_.uniqBy`

### 其他的小修改

 * 将 `_.sortByAll` 融合到了 `_.sortBy`
 * 改变这个类别 `_.at` 为 *“Object”*
 * 改变这个类别 `_.bindAll` 为 *“Utility”*
 * 在 `master` 分支下，将 `./lodash.js` 移动到 `./dist/lodash.js`
 * 在 `npm` 分支下，将 `./index.js` 移动到 `./lodash.js`
 * 将 `_.clone` & `_.flatten` 函数的参数中删除了 `isDeep` 参数
 * `_.bindAll` 将不再支持绑定所有的函数，当没有名字传入的时候

### 总结
总之这次更新来的挺突然，感觉改动了好多东西，如果你的代码用了较多的话，暂时不建议去更新的。
更多内容呢详情请看官方 [changelog](https://github.com/lodash/lodash/wiki/Changelog)
