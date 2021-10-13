import React from 'react'

import Aside from '../Aside'

import styles from './style.module.css'

export default function Features({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className={styles.section}>
      <Aside />
      <div className={styles.features}>{children}</div>
    </div>
  )
}
