import React from 'react'

import { useMobile } from '../../../hooks'
import SummaryCollapse from './Collapse'
import SummaryTabs from './Tabs'
import styles from './style.module.scss'

export default function Summary() {

  const isMobile = useMobile()

  return (
    <div className={styles.section}>
      <div className={styles.title}>Why Go+</div>
      {isMobile ? <SummaryCollapse /> : <SummaryTabs />}
    </div>
  )
}
