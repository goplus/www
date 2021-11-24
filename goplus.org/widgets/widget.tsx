import { ReactElement } from 'react'
import ReactDOM from 'react-dom'
import EnsureMounted from 'components/EnsureMounted'

import './style.scss'

export function defineWidget(name: string, element: ReactElement) {
  const Clz = class extends HTMLElement {
    constructor() {
      super()
    }
  
    connectedCallback() {
      // TODO: use shadowDOM (we should deal with style properly)
      this.innerHTML = ''
      ReactDOM.render(<EnsureMounted>{element}</EnsureMounted>, this)
    }
  }
  window.customElements.define(`goplus-www-${name}`, Clz)
}
