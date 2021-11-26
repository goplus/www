/**
 * @file Loader for goplus widgets
 * @description When modifying content of this file, keep browsers-support in mind, cuz this file will not be babel-ed
 * @todo Use babel (maybe and tsc) to process this file before publish
 */

// Usage：
// <script data-widgets="header,footer" src="https://xxx/loader.js"></script>
// <goplus-header></goplus-header>
// <goplus-footer></goplus-footer>

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

  // Value of this variable will be replaced with widgets' manifest info when building
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
