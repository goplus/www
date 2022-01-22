/**
 * @file Loader for goplus widgets
 * @description It loads widgets.
 */

// Usage：
// <script data-widgets="header,footer" src="https://xxx/loader.js"></script>

// Injected by `widgets/build.js`
declare let MANIFEST: {
  [widgetName: string]: string[]
}

(function() {

  // Value of this variable will be replaced with widgets' manifest info when building
  const manifest = MANIFEST

  function loadWidget(widgetName: string) {
    const assets = manifest[widgetName] || []

    function load() {
      // Asume that one script & at most one style for one widget
      const scriptUrl = assets.find(asset => /\.js$/.test(asset))
      const styleUrl = assets.find(asset => /\.css$/.test(asset))
      if (scriptUrl == null) return
      const script = document.createElement('script')
      script.src = scriptUrl
      if (styleUrl != null) {
        script.setAttribute('data-style-url', styleUrl)
      }
      document.body.appendChild(script)
    }

    // TODO: consider using `<script defer>`?
    if (document.readyState !== 'loading') load()
    else window.addEventListener('DOMContentLoaded', load)
  }

  ;(document.currentScript?.getAttribute('data-widgets') || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .forEach(loadWidget)
})()
