import { ReactNode } from 'react'
import ReactDOM from 'react-dom'
import EnsureMounted from 'components/EnsureMounted'

import styles from './style.module.scss'

export type Renderer = (el: HTMLElement) => ReactNode

export function defineWidget(name: string, render: Renderer) {
  // do nothing if executed at server
  if (typeof window === 'undefined') return

  const tagName = `goplus-${name}`

  const Clz = class extends HTMLElement {
    connectedCallback() {
      const rendered = render(this)
      // TODO: use shadowDOM (we should deal with style properly)
      this.innerHTML = ''
      // `display` value of custom element defaults to `inline`
      const style = document.createElement('style')
      style.innerHTML = `${tagName} { display: block; }`
      document.head.appendChild(style)

      ReactDOM.render(
        <EnsureMounted className={styles.wrapper}>
          {rendered}
        </EnsureMounted>,
        this
      )
    }
  }
  window.customElements.define(tagName, Clz)
}

export function getAttr(el: HTMLElement, name: string) {
  return el.getAttribute(name) ?? undefined
}

export function getBoolAttr(el: HTMLElement, name: string) {
  const val = getAttr(el, name)
  if (val == null) return val
  return val !== 'false'
}

export function isElementNode(node: Node): node is Element {
  return node.nodeType === Node.ELEMENT_NODE
}

export function isTextNode(node: Node): node is Text {
  return node.nodeType === Node.TEXT_NODE
}
