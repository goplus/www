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

/** Join class names */
export function cns(...classNames: Array<string | null | undefined | false>) {
  return classNames.filter(Boolean).join(' ')
}

/** Code for xgo.dev may be runned on pages other than xgo.dev (with widgets), which 
 * means relative URLs like `/download` may be resolved to `<other-site-origin>/download`,
 * which is not expected. So we need to get origin based on current enviroment information 
 * to construct absolute URL */
export function getOrigin() {
  if (process.env.NODE_ENV === 'development') {
    //'development' Environment
    return 'http://localhost:3000'
  } else {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' && process.env.VERCEL_BRANCH_URL) {
      // 'preview' Environment
      return 'https://' + process.env.VERCEL_BRANCH_URL
    } else {
      //'production' Environment
      return 'https://xgo.dev'
    }
  }
}
