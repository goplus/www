import { ReactElement } from 'react'
import ReactDOM from 'react-dom'
import EnsureMounted from 'components/EnsureMounted'

import styles from './style.module.scss'

export function defineWidget(name: string, element: ReactElement) {
  const tagName = `goplus-${name}`

  const Clz = class extends HTMLElement {
    connectedCallback() {
      // TODO: use shadowDOM (we should deal with style properly)
      this.innerHTML = ''
      // `display` value of custom element defaults to `inline`
      const style = document.createElement('style')
      style.innerHTML = `${tagName} { display: block; }`
      document.head.appendChild(style)

      ReactDOM.render(
        <EnsureMounted className={styles.wrapper}>
          {element}
        </EnsureMounted>,
        this
      )
    }
  }
  window.customElements.define(tagName, Clz)
}
