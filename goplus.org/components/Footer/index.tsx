import React from 'react'
import Image from 'next/image'

import styles from './style.module.css'

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.qiniuDoll}>
        <Image width={100} height={82} src="/qiniu_doll.png" alt="Qiniu Doll Logo" />
      </div>
      <div className={styles.links}>
        <a href="https://github.com/goplus/gop" rel="noreferrer">Github</a>
        <a href="https://github.com/goplus/gop/blob/main/LICENSE" rel="noreferrer">License</a>
      </div>
      <div className={styles.powerBy}>
        <span>Power by</span>
        <a style={{ height: 20 }} href="https://www.qiniu.com" rel="noreferrer">
          <Image width={31} height={20} src="/qiniu_logo.svg" alt="Qiniu Logo" />
        </a>
      </div>
    </div>
  )
}
