import * as React from 'react'
import Project from '../my-project/Project';

export default function MyProject() {
  return (
    <div>
      <Project title="MinecraftManager" href="https://github.com/XGHeaven/minecraft-manager">
        Minecraft 服务端管理软件，采用 Node.js + vue 的前后端分离架构，能够自动下载 JAR 包，启动服务器，备份服务器等操作。
      </Project>
      <Project title="NOS Node SDK" href="https://github.com/XGHeaven/nos-node-sdk">
        一个现代化的 NOS(网易云对象存储) Node.js SDK
      </Project>
      <Project title="网易云音乐 Node.js SDK" href="https://github.com/XGHeaven/netease-music-sdk">
        网易云音乐 Node.js SDK，给你纯净的开发体验。
      </Project>
      <Project title="Meirin Node.js 频率限制库" href="https://github.com/XGHeaven/meirin">
        一个基于表达式强大的频率限制库，支持强大的表达式，支持自定义存储层，帮助你更好的构建频率限制逻辑。
      </Project>
      <Project title="HDU 教师评价脚本" href="https://github.com/hdu-coder/evaluate-teacher">
        一个评价教师的小脚本，就是在选课开始之前，需要评价教师(已经被移动了，链接在右侧）
      </Project>
      <div style={{textAlign: 'center'}}>And More to Github</div>
    </div>
  )
}
