/**
 * @file 用于加载 widget 内容的加载器
 * @description 注意该文件会被几乎不经处理地直接被插入页面运行，维护时需考虑代码的浏览器兼容性
 * @todo 简单地处理一下这个文件，比如 tsc & babel
 */

// 预期的使用姿势：
// <script data-widgets="header,footer" src="https://xxx/loader.js"></script>
// <goplus-www-header></goplus-www-header>
// <goplus-www-footer></goplus-www-footer>

(function() {

  function loadJs(url, parent) {
    return new Promise(function(resolve, reject) {
      var script = document.createElement('script')
      script.onload = resolve
      script.onerror = reject
      script.src = url
      parent.appendChild(script)
    })
  }

  function loadCss(url, parent) {
    return new Promise(function(resolve, reject) {
      var link = document.createElement('link')
      link.onload = resolve
      link.onerror = reject
      link.rel = 'stylesheet'
      link.href = url
      parent.appendChild(link)
    })
  }

  // 在构建时会被替换为 widgets 组件构建信息映射表
  var manifest = MANIFEST

  function load(widget) {
    var assets = manifest[widget]
    if (!assets || assets.length <= 0) return

    function loadWidget() {
      return Promise.all(assets.map(function(asset) {
        if (/\.js$/.test(asset)) return loadJs(asset, document.body)
        if (/\.css$/.test(asset)) return loadCss(asset, document.head)
      }))
    }

    if (document.readyState !== 'loading') loadWidget()
    else window.addEventListener('DOMContentLoaded', loadWidget)
  }

  var widgets = (document.currentScript.getAttribute('data-widgets') || '').split(',').map(s => s.trim()).filter(Boolean)
  widgets.forEach(load)
})()
