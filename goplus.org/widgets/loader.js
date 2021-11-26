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
    var script = document.createElement('script')
    script.src = url
    parent.appendChild(script)
  }

  function loadCss(url, parent) {
    var link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = url
    parent.appendChild(link)
  }

  // Value of this variable will be replaced with widgets' manifest info when building
  var manifest = MANIFEST

  function load(widget) {
    var assets = manifest[widget] || []
    function loadWidget() {
      assets.forEach(function(asset) {
        if (/\.js$/.test(asset)) loadJs(asset, document.body)
        else if (/\.css$/.test(asset)) loadCss(asset, document.head)
      })
    }

    if (document.readyState !== 'loading') loadWidget()
    else window.addEventListener('DOMContentLoaded', loadWidget)
  }

  ;(document.currentScript.getAttribute('data-widgets') || '')
    .split(',')
    .map(function (s) { return s.trim() })
    .filter(Boolean)
    .forEach(load)
})()
