/* eslint-disable @next/next/no-img-element */

import React from 'react'
import Image from 'next/image'

import QiniuLogo from 'components/QiniuLogo'
import imgDoll from 'public/qiniu_doll.png'

import styles from './style.module.scss'

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.qiniuDoll}>
        <img width={100} height={82} src={imgDoll.src} alt="Qiniu Doll Logo" />
      </div>
      <div className={styles.links}>
        <a href="https://github.com/goplus/gop" rel="noreferrer">
          Github <ArrowIcon />
        </a>
        <a href="https://github.com/goplus/gop/blob/main/LICENSE" rel="noreferrer">
          License <ArrowIcon />
        </a>
      </div>
      <div className={styles.powerBy}>
        <span>Powered by</span>
        <a style={{ height: 20 }} href="https://www.qiniu.com" rel="noreferrer">
          <QiniuLogo />
        </a>
      </div>
    </div>
  )
}

function ArrowIcon() {
  return (
    <svg className={styles.arrow} width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M4,5 L4,14 L13,14 L13,15 L3,15 L3,5 L4,5 Z" transform="rotate(-135 8 10)" fill="#666" fillRule="evenodd"/>
    </svg>
  )
}
