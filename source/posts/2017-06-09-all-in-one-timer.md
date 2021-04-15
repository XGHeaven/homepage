---
title: all in one - timer
date: 2017-06-09 00:50:14
categories: All in One
tags:
  - All in One
  - Golang
  - Timer
---

# All in one - Timer 定时器

<!-- TOC -->

这一篇文章，我们主要讲解一下不同语言之间关于定时器的操作和坑。

首先说一些这个坑中的一些前提，首先我这里所有的都是和 JavaScript 与 C++ 相比较进行学习的，所以下面不会出现 JavaScript 相关的教程，除非 JavaScript 在这个上面的坑太多，非讲不可。如果你没有相关的语言基础，请去学习。谢谢。

首先先从 golang 语言讲起来

# Golang

在 golang 中单次定时器和循环定时器分别是 Timer 和 Ticker。这两个都是一个结构体，结构如下

```go
type Timer struct {
        C <-chan Time
        // contains filtered or unexported fields
}
type Ticker struct {
        C <-chan Time // The channel on which the ticks are delivered.
        // contains filtered or unexported fields
}
```

其中 `C` 是一个 只读的 Time 类型的 channel，定时器根据传入的时间设置，定时向这个 channel 输入时间。你需要做的是等待这个 channel 中的数据。

每一个结构体都有如下方法：

```go
func (t *Timer) Reset(d Duration) bool
func (t *Timer) Stop() bool
func (t *Ticker) Stop()
```

首先 Timer 和 Ticker 的区别不是很大，下面我们将两者的共性以 Timer 来讲述， 后面会针对两者不同的内容进行讲解。

```go
package main

import "time"

func main() {
    timer := time.NewTimer(time.Second * 2)
  	time := <- timer.C
    println("Timer expired")
}
```

参数接受一个时间参数，表示多久后向 channel 传输数据，也就是你想要定时的间隔，上面这个例子表示两秒之后输出 `Timer expired` 。

那么每次我们都要这么麻烦的设置一个时间，然后等待 channel，运行制定的函数么？

其实不是的，golfing 给我们内置了一个函数，类似于 JavaScript 的 setTimeout，那就是 AfterFunc。

函数如下：

```go
func AfterFunc(d Duration, f func()) *Timer
```

就是他会给你返回一个 `*Timer` ，并在指定时间之后，在 goroutine 中运行你的函数。

上面说完了如何启动，那么怎么停止呢？很简单，就是 `Stop`。

```go
package main

import "time"

func main() {
    timer := time.NewTimer(time.Second)
    go func() {
        <- timer.C
        println("Timer expired")
    }()
    stop := timer.Stop()
    println("Timer cancelled:", stop)
}
```

```
Timer cancelled: true
```

调用停止之后，会返回一个 Bool 值：

* `true` 停止成功
* `false` 已经被停止或者已经到期触发

这里有一点需要注意的是，调用停止之后，并不会关闭 channel，如果你想检测那么你可以通过额外添加一个 done channel 来协助。

```go
package main

import "time"

func main() {
    timer := time.NewTimer(time.Second)
    done := make(chan bool)
    go func() {
      select{
        case <- timer.C:
          println("Timer expired")
        case <- done:
          println("Timer stop")
      }
    }()
    stop := timer.Stop()
    done <- true
    println("Timer cancelled:", stop)
}
```

```
Timer stop
Timer cancelled: true
```

所以比较麻烦，大家可以自己封装一下。

## Timer

单次定时器有一个特殊的方法就是 Reset，他可以将一个定时器的超时时间重新定义，这样你可以重复利用这个定时器。

```go
package main

import "time"

func main() {
    timer := time.NewTimer(time.Second)
    go func() {
      <- timer.C
      println("Timer expired")
      <- timer.C
      println("Timer expired again")
    }()
    time.Sleep(time.Second * 2)
    timer.Reset(time.Second)
    time.Sleep(time.Second * 2)
}
```

```
Timer expired
Timer expired again
```

同理，你可以用在 AfterFunc 中

```go
package main

import "time"

func main() {
    timer := time.AfterFunc(time.Second, func() {
      println("Timer expired")
    })
    time.Sleep(time.Second * 2)
    timer.Reset(time.Second)
    time.Sleep(time.Second * 2)
}
```

```
Timer expired
Timer expired
```

简直和 JavaScript 中的 setTimeout 像的不能再像了。

## Ticker

这里的 Ticker 其实相当于 JavaScript 中的 setInterval，不过他没有类似 Timer 的 AfterFunc，只有一个最基础的构造器。

```go
package main

import "time"
import "fmt"

func main() {
    ticker := time.NewTicker(time.Millisecond * 500)
    go func() {
        for t := range ticker.C {
            fmt.Println("Tick at", t)
        }
    }()
    time.Sleep(time.Millisecond * 1500)
    ticker.Stop()
    fmt.Println("Ticker stopped")
}
```

```
Tick at 2012-09-22 15:58:40.912926 -0400 EDT
Tick at 2012-09-22 15:58:41.413892 -0400 EDT
Tick at 2012-09-22 15:58:41.913888 -0400 EDT
Ticker stopped
```

Ticker 同样也有同 Timer 一样无法关闭 channel 的问题，解决方法和 Timer 类似，我就不多说了。

不过 Ticker 的 Stop 函数与 Timer 的不太一样，因为他没有是否触发过的问题，所以 Ticker 的 Stop是没有返回值的，这一点需要注意。

暂时先写这一个，以后如果有新的，持续更新。
