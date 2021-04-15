import React from 'react'
import styled from '@emotion/styled'
import { assetURL } from './markdown-render'
import { Menu } from './menu'
import { siteConfigSource } from '../../sources'
import { useSource } from '../../react'

// const Menu = styled(Link)`
//   display: inline-block;
//   width: 100%;
//   height: 42px;
//   line-height: 42px;
//   color: white;
//   text-decoration: none;
//   padding: 0 24px;
//   transition: all 0.3s ease;
//   &:hover, &:active {
//     color: white;
//     background-color: rgba(100, 100, 100, .3);
//   }
// `

const Menus = styled.div`
`

const MenuBlank = styled.div`
  height: 20px;
`

const SideHead = styled.div`
  padding: 40px 0;
  text-align: center;
`
const SideAvatar = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
`
const SideName = styled.div`
  margin-top: 4px;
  color: white;
`

export function Aside() {
  const [site] = useSource(siteConfigSource, null)
  return (
    <div>
      <SideHead>
        <SideAvatar src={site?.avatar && assetURL(site?.avatar)}/>
        <SideName>
          XGHeaven
        </SideName>
      </SideHead>
      <Menus>
        <Menu to="/blog/" icon="home">
          首页
          </Menu>
        <Menu to="/blog/categories" icon="category">分类</Menu>
        <Menu to="/blog/tags" icon="tag">标签</Menu>
        <Menu to="/blog/articles" icon="article">Articles</Menu>
        {/* <Menu to="/blog/about" icon="">关于</Menu> */}
        <Menu to="/blog/friend-link" icon="link">Friend link</Menu>
      </Menus>
    </div>
  )
}
