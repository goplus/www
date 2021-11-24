/**
 * @file 在 mounted 前隐藏内容的容器
 * @desc 因为 Recat SSR/SSG 的限制，在客户端首次 render 时其状态值需要与 SSR/SSG 时一致，所以首次
 *       render 结果可能是不正确的；如在移动端对于是否 mobile 的判断可能是错的（初始状态值为 `false`）
 *       此时会有一个内容的闪烁，即从 PC 端视图变成移动端视图；对于这种情况，将页面使用 `EnsureMounted` 包裹，
 *       确保首次渲染的内容不可见，界面更加稳定，对用户的体验会更好
 */

import React, { PropsWithChildren, useEffect, useState } from 'react'

export default function EnsureMounted({ children }: PropsWithChildren<{}>) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return <div style={{ opacity: mounted ? 1 : 0 }}>{children}</div>
}
