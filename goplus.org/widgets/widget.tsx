import { ReactNode } from 'react'
import ReactDOM from 'react-dom'
import EnsureReady from 'components/EnsureReady'

import './host.scss'

export type Renderer = (el: HTMLElement) => ReactNode

const styleUrl = document.currentScript?.getAttribute('data-style-url')

export function defineWidget(name: string, render: Renderer) {
  // do nothing if executed at server
  if (typeof window === 'undefined') return

  const tagName = `goplus-${name}`

  const Clz = class extends HTMLElement {
    connectedCallback() {
      const rendered = render(this)
      const shadow = this.attachShadow({mode: 'open'})
      const loads: Array<Promise<void>> = []

      if (styleUrl != null) {
        loads.push(loadCss(styleUrl, shadow))
      }

      const container = document.createElement('div')
      shadow.appendChild(container)

      ReactDOM.render(
        <EnsureReady extra={loads}>
          {rendered}
        </EnsureReady>,
        container
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

function loadCss(cssUrl: string, attachTo: Node) {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = cssUrl
  const promise = new Promise<void>((resolve, reject) => {
    link.addEventListener('load', () => resolve())
    link.addEventListener('error', reject)
  })
  attachTo.appendChild(link)
  return promise
}
