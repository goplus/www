# Web Widgets provided by goplus.org

### How to use

#### 

外部站点的使用姿势可以参考 `test/widget/index.html` 内容，引入代码如下：

```html
<script data-widgets="header,footer" src="https://xxx/loader.js"></script>
<goplus-header></goplus-header>
<goplus-footer></goplus-footer>
```

`/widgets/loader.js` 会提供加载组件用的 `load` 方法，使用方使用该 `load` 方法将指定组件加载到对应的 HTML 容器中即可：

```ts
window.__qiniu_www_widgets__.load(
  componentName, // 组件名，如 `header` / `footer`，对应 `widgets/` 目录下的内容
  targetElement // 目标 HTML 元素，组件将被渲染到该元素中
)
```

#### 其他操作

除了被渲染到指定位置外，组件也可以定义其他接口与外部进行交互；这部分内容会被挂载在

```ts
window.__qiniu_www_widgets__.components[componentName]
```

上；如通过调用

```ts
window.__qiniu_www_widgets__.components['feedback-entry'].showModal()
```

可以调起用户反馈浮层

### widgets 内容的生成

`widgets/` 下的内容（如 `header.tsx` / `footer.tsx`）是对应的组件的入口文件，执行 `node widgets.js` 会使用与 `next build` 一致的配置（稍作调整）对这些文件分别构建并输出到结果中

为了确保被嵌入的组件在外部站点的页面上也能正常运行，这里要求每个组件在被导出为 widget 内容时使用 `components/Layout/Widget` 进行包裹，该组件提供了依赖 next.js 的组件所需要的基本的运行环境（如 `next/router`）

上边提到的加载组件用的 `loader.js` 由 `widgets/loader.js` 得到，目前不会通过 babel 等工具处理，仅通过简单的正则替换来将本次构建结果的映射信息置入到内容中，确保 `loader.js` 可以得到 widgets 内容准确的线上地址

### TODO

* `loader.js` 做简单的处理，包括：

    1. 压缩
    2. 基本的兼容性处理

* 考虑基于 Web Component 提供可嵌入组件，需要考虑：

    1. React 对于 shadow dom 中事件的支持问题（据说 17.x 没问题）
    2. 浏览器版本的支持

* widgets 内容支持开发模式

    目前只支持直接执行 `node widgets.js` 来生成 widgets 内容，不支持 watch & 自动重编译
