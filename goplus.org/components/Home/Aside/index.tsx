import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MoveTo } from 'moveto'

import styles from './style.module.css'
import { useHash } from '../../../hooks/url'

const defaultScrollDuration = 400 // 默认滚动动画时间 ms
const headerHeight = 72 // Header 的高度，单位 px

export default function Aside() {
  const [hash] = useHash()

  const anchors = React.useRef<Array<{ href: string; text: string; className?: string }>>([
    {
      href: '#rational-number',
      text: 'Rational number: bigint, bigrat, bigfloat'
    },
    {
      href: '#map-literal',
      text: 'Map literal'
    },
    {
      href: '#slice-literal',
      text: 'Slice literal'
    },
    {
      href: '#deduce-struct-type',
      text: 'Deduce struct type'
    },
    {
      href: '#list-comprehension',
      text: 'List comprehension'
    },
    {
      href: '#select-data-from-a-collection',
      text: 'Select data from a collection'
    },
    {
      href: '#check-if-data-exists-in-a-collection',
      text: 'Check if data exists in a collection'
    },
    {
      href: '#for-loop',
      text: 'For loop'
    },
    {
      href: '#for-range-of-udt',
      text: 'For range of UDT'
    },
    {
      href: '#for-range-of-udt2',
      text: 'For range of UDT2'
    },
    {
      href: '#lambda-expression',
      text: 'Lambda expression'
    },
    {
      href: '#overload-operators',
      text: 'Overload operators'
    },
    {
      href: '#error-handling',
      text: 'Error handling'
    },
    {
      href: '#auto-property',
      text: 'Auto property'
    },
    {
      href: '#unix-shebang',
      text: 'Unix shebang'
    }
  ])

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
    const activeAnchor = anchors.current.find(({ href }) => href === ('#' + hash))
    if (activeAnchor == null) return
    const target = document.querySelector(`[data-id="${hash}"]`)
    if (target == null || !(target instanceof HTMLElement)) return
    scrollTo(target.offsetTop - headerHeight)
  }, [hash])

  return (
    <div className={styles.aside}>
      {anchors.current.map(anchor => (
        <div key={anchor.href} className={`${styles.anchorWrap} ${anchor.href === ('#' + hash) ? styles.selected : ''}`}>
          <a href={anchor.href}>{anchor.text}</a>
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
