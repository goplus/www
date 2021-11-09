import React from 'react'

import TextWrapper from '../../../TextWrapper'
import { summaryItems } from '../common'
import styles from './style.module.scss'

export default function SummaryTabs() {

  const [selected, setSelected] = React.useState(0)
  const transform = `translateX(${100 * selected}%)`

  return (
    <>
      <div className={styles.tabs}>
        {summaryItems.map((item, index) => (
          <div
            className={`${styles.tab} ${selected === index ? styles.selectedTab : ''}`}
            key={item.title}
            onClick={() => setSelected(index)}
          >
            {item.title}
          </div>
        ))}
        <div className={`${styles.tab} ${styles.backgroundBar}`} style={{ transform }}></div>
      </div>
      <div className={styles.tabContent}>
        <TextWrapper>
          {summaryItems[selected].content}
        </TextWrapper>
      </div>
    </>
  )
}
