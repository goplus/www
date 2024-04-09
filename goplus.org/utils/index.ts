import { Children, ReactNode, isValidElement } from 'react'
import variables from './variables.module.scss'
import { loadEnvConfig } from '@next/env'

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


export function getOrigin() {
  if (process.env.NODE_ENV === 'development') {
    return "http://localhost:3000"
  } else {
    if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL) {
      // 在预览环境下，将 /download 路径重定向到预览页面
      return process.env.VERCEL_URL
    } else {
      // 在其他环境下，保持 /download 路径不变
      return "https://goplus.org"
    }
  }
}
