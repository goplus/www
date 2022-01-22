/**
 * @file 在内容就绪（一般即 mounted）前隐藏内容的容器
 * @desc 因为 React SSR/SSG 的限制，在客户端首次 render 时其状态值需要与 SSR/SSG 时一致，所以首次
 *       render 结果可能是不正确的；如在移动端对于是否 mobile 的判断可能是错的（初始状态值为 `false`）
 *       此时会有一个内容的闪烁，即从 PC 端视图变成移动端视图；对于这种情况，将页面使用 `EnsureReady` 包裹，
 *       确保首次渲染的内容不可见，界面更加稳定，对用户的体验会更好
 */

import React, { ReactNode, useEffect, useState } from 'react'

export interface Props {
  children: ReactNode
  extra?: Array<Promise<unknown>>
}

export default function EnsureReady({ children, extra = [] }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    if (extra.length === 0) {
      setMounted(true)
      return
    }
    Promise.all(extra).then(() => {
      setMounted(true)
    })
  }, [extra])
  return <div style={{ opacity: mounted ? 1 : 0 }}>{children}</div>
}
