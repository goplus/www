import { Children, ReactNode, isValidElement } from 'react'
import variables from './variables.module.scss'

/** 判断当前是否在浏览器中执行，与之对应的是在 Node.js 环境执行（生成静态页面时） */
export function isBrowser() {
  // https://github.com/zeit/next.js/issues/5354#issuecomment-520305040
  return typeof window !== 'undefined'
}

export function getText(node: ReactNode): string {
  return Children.toArray(node).map(child => {
    if (typeof child === 'string') {
      return child
    }
    if (typeof child === 'number') {
      return child + ''
    }
    if (isValidElement(child) && child.props) {
      return getText(child.props.children)
    }
    return ''
  }).join(' ')
}

/** Check if mobile based on media-query match */
export function matchMediaMobile() {
  return window.matchMedia(`(max-width: ${variables.mobileMaxWidth})`)
}
