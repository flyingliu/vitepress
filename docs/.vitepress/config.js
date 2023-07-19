module.exports = {
  title: 'Hello VitePress3333',
  description: 'Just playing around.',
  base: '/vitepress/',
  markdown: {
    lineNumbers: true,
    toc: { includeLevel: [1, 2] },
  },
  themeConfig: {

    siteTitle: "Kitty",
    logo: "https://picx.zhimg.com/52c21ec34_l.jpg?source=32738c0c",
    nav: [
      { text: "Guide", link: "/guide/" },
      { text: "GuideTest", link: "/guide/test" },
      { text: "gitee", link: "https://gitee.com/geeksdidi" },
    ],
    socialLinks: [
      { icon: "github", link: "https://gitee.com/geeksdidi" },
    ],
    sidebar: [
      {
        text: "组件库源码实现",
        items: [
          {
            text: "组件库环境搭建",
            link: "/articles/组件库环境搭建",
          },
          { text: "gulp的使用", link: "/articles/gulp的使用" },
        ],
      },
      {
        text: "vue教程",
        items: [
          {
            text: "pina和vuex",
            link: "/articles/pina和vuex",
          },
        ],
      },
    ],
  },

}