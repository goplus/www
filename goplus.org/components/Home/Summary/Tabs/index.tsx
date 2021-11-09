import React from 'react'

import { summaryItems } from '../common'
import commonStyles from '../style.module.scss'
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
      <div className={`${styles.tabContent} ${commonStyles.textWrapper}`}>
        {summaryItems[selected].content}
      </div>
    </>
  )
}
