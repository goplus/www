import React, { ReactNode } from 'react'
import ReactDOM from 'react-dom'
import EnsureReady from 'components/EnsureReady'

import './host.scss'

export type Renderer = (el: HTMLElement) => ReactNode

// The loader script will provide style url (by attribite `data-style-url`) for us
const styleUrl = document.currentScript?.getAttribute('data-style-url')

export function defineWidget(name: string, render: Renderer) {
  // do nothing if executed at server
  if (typeof window === 'undefined') return

  const tagName = `goplus-${name}`

  const Clz = class extends HTMLElement {
    async connectedCallback() {
      const { width, height } = this.getBoundingClientRect()
      const rendered = render(this)
      const shadow = this.attachShadow({ mode: 'open' })
      const waitings: Array<Promise<unknown>> = []

      if (styleUrl != null) {
        waitings.push(loadStyle(styleUrl, shadow))
      }

      const container = document.createElement('div')
      // As a placeholder to keep widget size stable
      container.setAttribute('style', `width: ${width}px; height: ${height}px;`)
      shadow.appendChild(container)

      const rendering = new Promise<void>(resolve => {
        ReactDOM.render(
          <EnsureReady extra={waitings}>
            {rendered}
          </EnsureReady>,
          container,
          resolve
        )
      })

      await Promise.all([...waitings, rendering])
      container.removeAttribute('style')
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

function loadStyle(url: string, attachTo: Node) {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = url
  const promise = new Promise((resolve, reject) => {
    link.addEventListener('load', resolve)
    link.addEventListener('error', reject)
  })
  attachTo.appendChild(link)
  return promise
}
