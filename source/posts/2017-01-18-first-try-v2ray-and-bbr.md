---
title: 第一次尝试 v2ray 和 bbr 用于翻墙（非教程）
date: 2017-01-18 11:15:32
categories: Linux
tags:
- v2ray
- linux
- bbr
---

​	2017年到了，我也放假了，正好在这个时间看到了一个叫做 v2ray 的代理软件，发现他非常符合我的需求，至少他有一下几个优点：

* 支持多入多出，也就是可以同时监听多个接口，接收代理请求，然后通过多个输出端口进行代理。
* 既然支持多入多出，不支持多协议怎么可以呢？他支持 ss，socks，vmess 等协议
* 用 golang 写得，效率不会太低（我是说在相同算法和功能上，不是指他协议的加密传输算法）
* 社区比较活跃，我喜欢


鉴于上面的优点，我去研究了一下这个 v2ray，发现安装起来还是很简单的么。

具体安装方式，请参考 [v2ray install](https://www.v2ray.com/chapter_01/install.html) ，配置什么的我就不多说什么了，官网上面讲的很清楚。如果有什么问题，欢迎提交 issue 或者进入 telegram group 讨论，作者在里面还是很积极的。

不过现在 v2ray 总体来说对新手还不是很友好，期待以后的改进。而且暂时还没有 gui 管理界面，期待作者的添加。

说完了 v2ray，就不得不说 v2ray 相关的 tcp-bbr，谷歌大大提交的 tcp 拥塞解决算法，现在已经合并到 linux4.9 内核当中，听说对于高延迟长连接的线路有很大的优化作用，那么对于翻墙来说，这可是神器，怎么能不使用一下呢。

关于 bbr 的介绍，可以看这篇[知乎的文章](https://www.zhihu.com/question/53559433)

那么我就在我的 linode 服务器上开启一下，不过需要注意的是，不要使用 linode dashboard 中的 linux4.9 内核，因为那个内核是被 linode 修改过的，会无法开启 bbr，我们需要手动安装 linux4.9 内核。

[安装教程](https://blog.linuxeye.com/452.html)

是不是很期待呀，下面就是测试

未开启 bbr

{% asset_img without_bbr.png %}

开启 bbr

{% asset_img bbr.png %}

可能由于家里的带宽的原因，提升速度太不明显了2333，等以后有空回学校重新测试一下。

不过我不能确定是不是我的服务器网络质量太好了，导致加速不明显 2333
