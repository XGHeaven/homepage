---
title: 安装 CentOS7 中我所遇到的一些麻烦
date: 2018-10-14 14:12:02
category: CentOS
tags:
  - CentOS

---

<!-- TOC -->

> 自己家里有一台 Dell 服务器，之前一直跑着 FreeNAS，后来发现自己对 NAS 的需求并不是很高，所以我决定装回 Linux，之前用的 Debian，虽然 Debian 很好，但是没法只使用 root 用户，所以我又回归了 CentOS 系统，但是问题并没有我想的那么简单。

另外，这是一篇总结文章，所以`没有图`，见谅。

## Trouble 1: U 盘启动找不到启动盘

这里所说的找不到启动盘并不是说无法进入引导界面，而是说进入了引导界面但是无法正确加载安装镜像。具体表现请往下看

### 问题描述

相信大家装过系统的都知道，在 Windows 上面有很多 ISO 刻录到 U 盘的工具，这些工具非常好用，所以我就理所当然的用 `ISO to USB` 这个软件刻录启动 U 盘。

我刻录的是 `CentOS-7-DVD` 的版本，大约 4.2G，里面包含了必要的安装包。

U 盘刻录完成，插入电脑，启动，一切正常，进入选择界面，选择 `Install CentOS 7`，之后问题来了，出现了 `failed to map image memory` 提示，之后等了一段时间之后就一直出现 `warning:dracut-initqueue timeout-starting timeout script` 的提示，最终显示启动失败，进入恢复模式，显示 `dracut:/#` 终端提示符，不管怎么重启都不行。

当然，Google 当然是有结果的，[《安装CentOS7.4出现failed to map image memory以及warning:dracut-initqueue timeout的解决办法》](https://blog.csdn.net/weixin_42609121/article/details/81737671) 指出了原因和解决方案。

### 解决方案

出现这个原因是因为找不到启动盘，解决方案其实也很简单，就是手动设置一下就可以了。

首先找到你的 U 盘是哪个硬盘符，方法就是在恢复模式下运行 `ls -l /dev | grep sd`，可以看到一系列的文件，一般情况下 sda 是硬盘，sdb 是 U 盘，sda1 是硬盘上第一个分区，同理 sda2 是第二个分区。如果你有多个硬盘，那么 U 盘可能是 sdc, sdd 等等，找到你的 U 盘启动盘的分区，我的是 sdb1。

然后在选择界面的时候按 e，然后将 `inst.stage2=hd:LABEL=CentOS\x207\x20x86_64.check` 修改为 `inst.stage2=hd:/dev/sdbx(你u盘所在)`，之后修改结束之后按 `Ctrl+x` 退出就可以正常进入安装界面了。

那么有人会说每次启动都要这么做么？答案是的，但实在是太麻烦了，不急，这个也是有办法解决的，办法请看 Trouble 3 的解决方案。

## Trouble 2: 安装的时候明明插着网线但是却提示无网络

### 问题描述

进入安装界面之后，会有一个网络的选项，一直提示未连接，不管你怎么设置。无论是你拔插网线还是禁用启用都不行。

### 解决方案

这是因为 CentOS 默认的网络是不自动连接的，你可以在设置界面，选择 General ，也就是第一个标签页，把启动时自动连接网络的选项勾选，然后保存。然后就会自动去获取 ip 地址然后可以上网了。

这一点的设计实在是太 SB 了，不知道为啥要设计成这个样子。

## Trouble 3: CentOS 安装的时候一直卡死在设置安装源

### 问题描述

当我们成功进入安装界面的时候，你会发现他的安装源是无效的，需要你自己去设置。
理论上来讲使用的是 DVD 的镜像，是自带了很多包的，不会出现这种情况。
而且出现这种情况的时候，是无法选择本地的安装源的，只能填写网络。
但是不管你填写的是官方的安装源还是阿里、网易的安装源，都会一直卡死在设置安装源这个环节。

### 解决方案

经过 Google，得知原因是因为刻录 U 盘的方式不对。[《CentOS7安装时的新问题》](http://blog.sina.com.cn/s/blog_757fc71d0102w7bb.html) 给出了原因和解决方案。

引用之

> 绝望中，无意间看到 Centos 百科(https://wiki.centos.org/zh/HowTos/InstallFromUSBkey) 上的一段话：“由于 CentOS 7 安装程序的映像采用了特殊的分区，而截至 2014 年 7 月，大部份Windows 工具都不能正确地转移，因此利用 USB 存储器开机时会导致不能预知的结果。（暂时）已知不适用的工具包括 unetbootin 和 universal usb installler。已确定能正确运作的有 Rufus、Fedora LiveUSB Creator、Win32 Disk Imager、Rawrite32 及 dd for Windows。如果采用 Windows 7 以上的版本，请先卸下该 USB 存储器（其中一个方法是在执行工具程序前把存储器格式化），否则 indows 可能会拒绝写入该存储器，出现 can't write to drive 错误及取消行动。”

可以得知，CentOS 的 ISO 镜像的刻录方式比较特殊，大部分软件都无法很好的兼容，但是 dd 可以非常好的兼容，所以这里我切换了刻录软件，使用 `Rufus` 进行刻录，并且选择 DD 模式。

然后重启启动，哈哈哈，不仅仅这个问题解决了，还完美解决了 Trouble 1 无法找到启动盘的问题。

## 安装完毕

记得之前安装的时候，也没有遇到这么多麻烦。这次既然遇到了就记录下来。

之后我就可以开心的玩耍了，装了 Docker，切换安装源到网易，安装 epel 等等。

