import React from 'react'

import LinkButton from 'components/UI/LinkButton'

import styles from './style.module.scss'

export default function Guide() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <h2 className={styles.title}>Get Started with Go+</h2>
        <p className={styles.slogan}>For engineering, STEM education, and data science</p>
        <div className={styles.btnsWrap}>
          <LinkButton className={styles.btn} primary href="https://github.com/goplus/gop/blob/main/doc/docs.md">
            Quick Start
          </LinkButton>
          <LinkButton className={styles.btn} href="https://github.com/goplus/gop#how-to-install">
            Install Go+
          </LinkButton>
        </div>
      </div>
    </div>
  )
}
