import React, { useState } from 'react'
import Link from 'next/link'

import styles from './style.module.css'
import { useHash } from '../../../hooks/url'

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

  return (
    <div className={styles.aside}>
      {anchors.current.map(anchor => (
        <div key={anchor.href} className={`${styles.anchorWrap} ${anchor.href === ('#' + hash) ? styles.selected : ''}`}>
          <Link href={anchor.href}>
            <a>{anchor.text}</a>
          </Link>
        </div>
      ))}
    </div>
  )
}
