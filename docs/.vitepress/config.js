// const components = import.meta.glob('@/views/components/dynamicDetails/**/*.vue', { eager: true })
// Object.entries(components).forEach(([path, definition]) => {
//   const componentName = $.util.toLine(path.split('/').at(-2))
//   app.component(componentName, definition.default)
// })


const path = require('path')
const articlesPath = path.resolve(__dirname,'../articles')
const dirTree = require("directory-tree")
const tree = dirTree(articlesPath)

const sidebarItems = tree.children.map(v=>{
  return {
    text: v.name.split('.')[0],
    link: '/' + tree.name + '/' + v.name
  }
})

module.exports = {
  title: '如是我闻',
  description: 'Just playing around.',
  base: '/vitepress/',
  markdown: {
    lineNumbers: true,
    // toc: { includeLevel: [1, 2] },
  },
  themeConfig: {
    siteTitle: "如是我闻",
    logo: "https://picx.zhimg.com/52c21ec34_l.jpg?source=32738c0c",
    nav: [
      { text: "Guide", link: "/guide/" },
      { text: "GuideTest", link: "/guide/test" },
      { text: "gitee", link: "https://gitee.com/flyingliu" },
    ],
    socialLinks: [
      { icon: "github", link: "https://gitee.com/flyingliu" },
    ],
    sidebar: [
      {
        text: "我的文章",
        items: sidebarItems,
      }
      // {
      //   text: "vue教程",
      //   items: [
      //     {
      //       text: "pina和vuex",
      //       link: "/articles/pina和vuex",
      //     },
      //   ],
      // },
    ],
  },

}