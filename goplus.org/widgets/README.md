# Web Widgets provided by goplus.org

Web-based widgets for 3rd-party websites to embed goplus-related content or function.

### Usage

#### 1. Import Widget Loader

```html
<script data-widgets="header,footer" src="https://goplus.org/widgets/loader.js"></script>
```

Note that you need to specify widgets to load by `data-widgets`. For all available widgets, check directory `/widgets/entries`.

#### 2. Render Widgets

Then just use corresponding custom element in you application to render widgets:

```html
<goplus-header></goplus-header>
<goplus-footer></goplus-footer>
```

For widget `foo`, use HTML tag `goplus-foo` to render it. For example, `<goplus-header></goplus-header>` renders widget `header`.

### Build Widgets

All files in directory `/widgets/entries` will be treated as widget entry files. For file `/widgets/entries/foo.tsx`, we will build a widget named `foo`. The build process is done by NPM script `build:widgets`:

```shell
npm run build:widgets
```

For more details, check file `/widgets/build.js`.

#### Debug Widgets Locally

Run NPM script `dev:widgets`:

```shell
npm run dev:widgets
```

Then launch a static file server under `/out`. Suppose the server listens to `8080`, open `http://localhost:8080` in your browser and you can check widgets in page.

### What Happened

We created a widget loader & widget files when building widgets. The loader file's location will be constant: `https://goplus.org/widgets/loader.js` and the file will not be cached by browser. 3rd-party sites will insert it in page and tell which widgets they want to load. The loader will load corresponding widget files for them.

The widget files defines custom elements on page, which makes HTML tags like `<goplus-header></goplus-header>` work. Widget files' location changes with widget content changing (content-based addressing). But the loader will always know the correct location for each widget, which makes it possible to cache widget files' content locally - actually we will tell browsers to cache widget file content as long as possible.
