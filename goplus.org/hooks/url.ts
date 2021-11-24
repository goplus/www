/**
 * @file 与 URL 相关的 hooks
 */

import { useState, useCallback, useEffect } from 'react'
import { isBrowser } from '../utils'

export type HashValue = string | null

/** 获取 URL hash 内容（去 `#` 号后），若无 hash 内容则返回 `null` */
export function useHash() {
  const [hash, setHash] = useState<HashValue>('')

  useEffect(() => {
    if (!isBrowser()) { return }

    const syncHash = () => setHash(getHash())
    syncHash()
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [])

  const updateHash = useCallback((newHash: HashValue) => {
    if (!isBrowser()) return

    const { history, document, location } = window
    const currentHash = getHash()

    // 新 hash 与当前 hash 等价，则不处理
    if (newHash === currentHash) return
    if (!newHash && !currentHash) return

    if (!newHash) {
      // 注意这里如果直接通过 `location.hash = ''` 来设置，页面会自动滚到顶部（浏览器行为）
      // 如果通过 `location.replace('')` 来设置，页面会刷新，所以这里通过
      // `history.replaceState` 来避免这个问题，也可以干掉 URL 最后的那个 `#`
      history.replaceState(
        history.state,
        document.title,
        location.pathname + location.search
      )
      // 此时不会触发 `hashchange` 事件，需要手动设置下
      setHash(null)
      return
    }

    // 如果不以 `#` 开头，就补一个 `#`（好像不补也没关系？）
    location.replace((newHash[0] !== '#' ? '#' : '') + newHash)
  }, [])

  return [hash, updateHash] as const
}

function getHash(): HashValue {
  if (!isBrowser()) {
    return null
  }
  const hash = window.location.hash.slice(1)
  return hash || null
}

export function useUrl() {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    setUrl(window.location.href)
    // TODO: subscribe location change by state push / pop
  }, [])
  return url
}
