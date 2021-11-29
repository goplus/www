import React, { useContext, useEffect, useRef, useState } from 'react'
import { MoveTo } from 'moveto'

import { useHash } from '../../../../../hooks/url'
import featureCtx from '../ctx'

import styles from './style.module.css'

const defaultScrollDuration = 400 // 默认滚动动画时间，单位 ms
const defaultScrollDebounceWait = 50 // 对 scroll 事件监听的延迟，单位 ms
const headerHeight = 72 // Header 的高度，单位 px

export default function Aside() {
  const [hash] = useHash()
  const { features } = useContext(featureCtx)
  const [activeFeature, setActiveFeature] = useState<string | null>(null)

  // 第三方库 moveto 在 module init 的时候就会尝试读 window，故它延后加载，这里存放其导出
  const MoveToRef = useRef<typeof MoveTo | undefined>()

  useEffect(() => {
    import('moveto').then(res => {
      MoveToRef.current = res.default
    })
  }, [])

  function scrollTo(top: number, duration = defaultScrollDuration) {
    if (duration <= 0 || !MoveToRef.current) {
      window.scroll({ top })
      return
    }
    const MoveToConstr = MoveToRef.current
    const moveTo = new MoveToConstr({ duration })

    // https://github.com/hsnaydd/moveTo/blob/164a7b47186282f48a4088b14d0c6fd8eb5cffef/src/moveTo.js#L157
    // Element.scroll 方法在 ie10 显示空字符串，改成从 window 调用
    moveTo.move(top - getGlobalScrollTop(), { container: window })
  }

  useEffect(() => {
    if (hash == null) return
    const targetFeature = features.find(feature => feature.id === hash)
    if (targetFeature == null) return
    scrollTo(getOffsetTop(targetFeature.heading) - headerHeight)
  }, [features, hash])

  const featuresRef = useRef(features)
  featuresRef.current = features

  useEffect(() => {
    // 如有性能问题，这里加个 debounce
    function handleScroll() {
      const scrollTop = getGlobalScrollTop()
      const features = featuresRef.current
      let activeFeature = null
      for (let i = 0; i < features.length; i++) {
        if (scrollTop >= (getOffsetTop(features[i].heading) - headerHeight)) {
          activeFeature = features[i].id
        }
      }
      setActiveFeature(activeFeature)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={styles.aside}>
      {features.map(feature => (
        <div key={feature.id} className={`${styles.anchorWrap} ${feature.id === activeFeature ? styles.selected : ''}`}>
          <a href={`#${feature.id}`}>{feature.title}</a>
        </div>
      ))}
    </div>
  )
}

// https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY
function getGlobalScrollTop() {
  if (window.pageXOffset !== undefined) return window.pageYOffset
  if (document.compatMode === 'CSS1Compat') return document.documentElement.scrollTop
  return document.body.scrollTop
}

/** Get absolute offset top */
function getOffsetTop(element: HTMLElement) {
  let top = 0
  let el: HTMLElement | null = element
  do {
    top += el.offsetTop
    el = el.offsetParent as HTMLElement | null
  } while (el)
  return top
}
