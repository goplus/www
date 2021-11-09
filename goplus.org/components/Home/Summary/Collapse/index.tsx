import React, { useState } from 'react'

import TextWrapper from '../../../TextWrapper'
import { summaryItems } from '../common'
import styles from './style.module.scss'

export default function SummaryCollapse() {
  const [activeIndex, setActiveIndex] = useState<null | number>(0)

  const summaryItemsView = summaryItems.map((item, i) => {
    const active = activeIndex === i
    const className = [styles.item, active && styles.active].filter(Boolean).join(' ')
    function handleToggle() {
      if (active) {
        setActiveIndex(null)
        return
      }
      setActiveIndex(i)
    }
    return (
      <section key={i} className={className}>
        <h3 className={styles.title} onClick={handleToggle}>
          {item.title}
          <ArrowIcon className={styles.arrow} />
        </h3>
        <div className={styles.content}>
          <TextWrapper>
            {item.content}
          </TextWrapper>
        </div>
      </section>
    )
  })

  return <>{summaryItemsView}</>
}

interface ArrowIconProps {
  className?: string
}

function ArrowIcon({ className }: ArrowIconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M6,7 L6,16 L15,16 L15,17 L5,17 L5,7 L6,7 Z" transform="scale(1 -1) rotate(-45 -20.092 -.464)" fill="#666" fillRule="evenodd"/>
    </svg>
  )
}
