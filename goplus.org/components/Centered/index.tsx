import React, { PropsWithChildren } from 'react'

import styles from './style.module.scss'

export default function Centered({ children }: PropsWithChildren<{}>) {
  return <div className={styles.centered}>{children}</div>
}
