import React from 'react'

import styles from './style.module.css'

function computedAnchor(title: string) {
  return title
    .split(/[^\w\d\s]/, 1)[0]
    .split(/\s+/)
    .map(word => word.toLocaleLowerCase())
    .join('-')
}

export default function Heading({ children }: React.PropsWithChildren<{}>) {
  if (typeof children !== 'string') {
    return null
  }
  return (
    <a id={computedAnchor(children)} className={styles.title}>
      {children}
    </a>
  )
}
