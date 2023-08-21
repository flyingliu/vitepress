# 产品客制化开发说明（前端）

## 环境搭建

### git仓库地址

- PC端前端仓库地址：http://gitlab.e-lead.cn:81/Goertek/goertek-web.git
- 移动端仓库地址 http://gitlab.e-lead.cn:81/Goertek/goertek-mobileapp.git

```js
npm config set registry http://nexus.ddns.e-lead.cn/repository/elead-npm-hosted/ //#切换 npm 源
npm adduser //#用户登录
username developer
password ******
```

`npm install --registry=http://nexus.ddns.e-lead.cn/repository/elead-npm/` 
#安装依赖, 在代码下载目录下执行，安装的产品版本可在package.json 文件中维护,

```JSON
{
  ...
  "dependencies": {
    "@erdp-apps/erdcloud_web": "2.6.5",
    "@erdp-apps/project_web": "2.7.7",
    "@erdp-apps/workflow_web": "1.3.4",
    "fullscreen": "^1.1.1",
    "vee-validate": "^4.9.6"
  },
  "devDependencies": {
    "@erdp-tools/build-app": "3.0.0",
    "@erdp-tools/erdp-serve": "2.1.0"
  },
  "scripts": {
    "buildinstall": "node node_modules/@erdp-tools/build-app/index.js && cd build/ && npm install --registry=http://nexus.ddns.e-lead.cn/repository/elead-npm/",
    "zipAct": "cd build/ && npx gulp zipAct --registry=http://nexus.ddns.e-lead.cn/repository/elead-npm-hosted/",
    "clear": "rm -rf node_modules build package-lock.json && npm cache clean --force",
    "serve": "npx erdp-serve start --nows",
    "dev": "erdp-serve start --proxy http://192.168.21.32:8090/ --mode sourcecode --port 8088",
    "sit": "erdp-serve start --proxy http://192.168.21.77:8090/ --mode sourcecode --port 8099",
  }
  ...
}
```

::: danger 注：
1. 如果产品版本有变动，则需在项目根目录下删除 node_modules文件夹和 package-lock.json 文件后重新执行 npm install
2. 如果`npm i` 安装不成功，试着加上npm源地址`npm i --registry=http://nexus.ddns.e-lead.cn/repository/elead-npm/`
:::

### 配置后端接口代理地址

1. 在根目录下erdp.serve.config.js文件中修改api接口地址

```js
const PORT = 8080 // 访问接口
const PROXY = 'http://192.168.21.32:8090/' // api接口地址 可以在命令行中配置
const sourceCode = false
const ROOT = require('path').resolve(__dirname, '../')
const APP_ID = 'erdp'
module.exports = {
  appId: APP_ID,
  root: ROOT,
  mode: sourceCode ? 'sourcecode' : null,
  proxy: PROXY,
  port: PORT,
  excludes: [],
  // 以下配置erdp.serve.config.js特有，命令行参数不支持
  //  * @type {import('http-proxy-middleware').Options}
  proxyConfig: {
    proxyTimeout: 60000, // 代理超时时间
    timeout: 60000,
    router: {
      '/goertek': 'http://192.168.21.32:8090/',
    },
  }
}
```

### 启动调试环境

`npm run serve` 或者启动带有api接口的服务。如： `npm run dev`
提示运行成功后，打开浏览器即可看到系统登录界面： http://localhost:8088/login.html

### 前端打包部署

1. 先安装打包依赖。`npm run buildinstall`
2. 打包文件夹。 `npm run zipAct`。可以在项目根目录下build文件夹下看到 goertek_web.zip 文件
3. 上传文件夹。项目启动后，管理员角色登录，从系统运维->微前端平台进入页面。点击上传应用，将打包好的goertek_web.zip文件上传即发布成功！发布成功后，刷新页面即可看到前端的修改。注意有必要清理下缓存。

### 工程结构说明

<pre>
apps - 产品资源包客制化
|- resource 主要的二开代码
  |-api api接口等
  |-lib 公用的JS、CSS、HTML文件
  |-goertek_i18n 国际化配置
  |-goertek_project_app goertek_project开头的文件夹都是和PPM相关联，客制化过来的
  |-goertek_workflow goertek_workflow开头的文件夹都是和工作流相关联，客制化过来的
  ... 其他文件夹
!- static 图片资源等
|- custom.js 客制化资源配置，主要解决资源映射问题
|- config.js 已失效
|- init.js 资源包入口文件，重点关注
build - 打包文件夹
erdp.serve.config.js 本地调试环境配置
</pre>

### 客制化
1. CSS 样式客制化：
  在`/goertek_web/apps/resource/lib/css/index.css`中进行 CSS 样式覆盖；

2. 模板客制化:

`apps\resource\lib\static\template.html`，复制产品模板至该文件中，修改模板，确保id一致，这样新的模板就能替换掉产品模板。这里模板使用建议调用以下方法:(有通用处理逻辑,并且只有使用该方法的模板才支持映射)

**模板生成**

$.el.template(targetSelector-容器,tmplId-模板 ID,params-模板参数);

**编译模板返回编译后的 html**

$.el.templateHtml(tmplId, params);

3. 接口客制化

`apps/custom.js` 文件中的 apiMapping 添加映射；
例如：
```js
 // api接口映射文件
var apiMapping = {
  get: {
    '/sys/v1/user/me': '/goertek/v1/sys/user/me',
    '/plan/v1/getMemberCompletionStatus': '/goertek/v1/projectTaskCompletion/queryList',
    '/plan/v1/getMemberCompletionStatus/details': '/goertek/v1/projectTaskCompletion/queryDetail',
    '/plan/v1/exportMemberCompletionStatus': '/goertek/v1/projectTaskCompletion/export'
  },
  ...
}
```
注：在可以加配置实现客制化需求的时候，可以要求产品添加配置实现，不必进行非必要的客制化，方便进行升级；


4. 文件客制化

将需要客制化的文件放至对应的位置，资源包 (apps/resource)，在"apps/custom.js"添加资源映射；
例如：
```js
  // html映射文件
var htmlMapping = {
  'resource:form.html,project_view': 'resource:form.html,goertek_project_view', // 客制化需求流程详情
  'resource:common-template.html,project_app': 'resource:common-template.html,
  ...
}
// js映射文件
var jsMapping = {
  // ppm js
  'resource:js/table.js,project_view': 'resource:js/table.js,goertek_project_view',// 视图入口 zj
  ...
}
```

### 关键配置

可以参见入口文件 `apps/init.js`。页面上代码都有注释，可以参考。


### 国际化

  - 页面 Dom 元素文本
页面元素添加"data-lang"属性,属性值为国际化词条 key; 例：
```html
<span data-lang="name">名称</span>
```

  - 页面 Dom 元素属性

页面元素添加"data-lang-attr"属性，属性值为"{属性名}#{词条 key}"；例：
```html
<span title="名称" data-lang-attr="title#name">名称</span>
```
上述只是标识某个元素需要翻译，还需在对应 js 文件中，执行翻译的动作 - 
```js
$.i18n.trans( ctt需要翻译的容器 )；
```

  - JS 文件使用中文
```js
$.i18n.get(key)
```
  - 系统管理-国际化配置: 产品国际化词条；

`apps\resource\goertek_i18n\locale\XX.json` - 第三方应用通用国际化词条，或者非资源包功能的国际化词
条；资源包下"/locale/" - 资源包内国际化词条，注意词条 key 需添加前缀("资源包 key_")，例:
"proj_template_oper": "Operation guide"(proj 模块下的词条)；

```JSON
  "proj_template_oper": "Operation guide", en-US.json
  "proj_template_oper": "操作指引", zh-CN.json
```

资源包下的国际化词条使用需调用方法将其添加至缓存中；例
```JS
$.i18n.registerCommonLang('goertek_i18n')
```

## 移动端

### 搭建移动端开发环境

移动端采用vite + vue3 + vant搭建，依赖包无需易立德公司私有源。从移动端仓库地址`http://gitlab.e-lead.cn:81/Goertek/goertek-mobileapp.git`拉取代码后，npm install安装依赖包，执行npm run dev，即可在浏览器上打开localhost:8090查看移动端页面。

### 移动端打包

针对不同的环境，执行相应的打包命令。如UAT环境打包命令为：

```bash
npm run build:uat
```
执行命令后，打包文件生成在dist目录下。将携带版本信息的package.json文件放入dist目录下，然后将dist目录下的文件打包成dist.zip压缩包。和pc端一样，管理员身份进入微前端管理界面，上传即可。

生产环境需登录到歌尔智能管理平台进行发布。

```JSON
"scripts": {
  "dev": "vite --mode development --host 0.0.0.0",
  "sit": "vite --mode sit --host 0.0.0.0",
  "build:dev": "vite build --mode development",
  "build:sit": "vite build --mode sit",
  "build:uat": "vite build --mode uat",
  "build:prod": "vite build --mode production"
},
```
### 移动端开发调试

#### 代码规范建议

1. 建议使用vue3组合式API,结合vue3.2 setup语法糖。代码量会减少很多。可以参考文章Vue3.2语法糖使用总结：https://juejin.cn/post/7169893449498689543
2. 尽量使用vant4提供的组件库。
3. 边距，颜色，字号等尽可能使用css变量。eg：color: var(--van-success-color);
4. 可能会多个地方用到的变量写到App.uve文件中，如:
```css
  root{
    --van-primary-color: #0ecd49!important;
    --bg: #F2f3f5;
  }
```
5. 暂无数据样式用
```html
<div class='null'></div>
```
6. 区块样式,加了一条分割线
```html
<div class='block'></div>
```

#### 全局方法
1. 弱提示
```js
$.msg.tips('这里是内容')
```

2. 加载提交

```js
$.msg.showLoading()
```

3. 隐藏加载提交
```js
$.msg.hideLoading()
```

4. localstroage操作
```js
$.LS.get(key), 
$.LS.set(key,value),
$.LS.remove(key),
$.LS.clear(),
```

4. 发起get请求
```javascript
 $.el.get('workflow/v1/task/todotask').then(res => console.log(res));
```
5. 发起post请求
```java
 $.el.post('workflow/v1/task/todotask',{}).then(res => console.log(res));
```

6. 获取数据字典。返回字典列表。字典数据可能是缓存数据！！！
```java
// 根据关键字获取字典列表
$.dict.values('project_ZSLKMbusinessAttr')  //  [{…}, {…}, {…}, {…}, {…}]
// 根据关键字和值获取显示字段值
$.dict.value('projLevl_name',"six_levl")  // 六星级
```

7. 获取当前登录用户,及判断用户身份.
```js
// 获取当前登录用户信息
$.el.auth.user 
// 判断当前登录用户身份, 未完善,项目身份没有加上去
$.el.auth.hasRole('PM')
```

8. 全局事件总线： $.bus, 更多使用方法可参考 https://blog.csdn.net/gtLBTNq9mr3/article/details/117887282
```js
$.bus.on('setReviewObject', fn)
$.bus.emit('setReviewObject', reviewObject)
```

#### 组件使用说明
1. 全局组件.

  vant组件可以在vue文件直接使用 eg. 

```html
<van-button type="primary" size="small" block >提交</van-button>
```
2. 自定义的全局组件
  - 区块标题，传参title，如果有区块要显示隐藏操作可以传入show-more， 初始状态用is-open传参 绑定@toggle="v=>show=v"

  ```html
  <e-title :title="title" show-more :is-open='show' @toggle="v=>show=v"></e-title>
  ```
3. 局部组件
  - 处理历史记录，局部组件，vue文件中需要注册。传参流程实例ID processInstanceId

  ```js
  import EComments from '@/components/EComments.vue'
  <e-comments :processInstanceId="processInstanceId"></e-comments>
  ```

















