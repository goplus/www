import React from 'react'

import gamesPic from './2d-games.jpg'
import dataProcessingPic from './data-processing.jpg'
import devOpsToolsPic from './dev-ops-tools.jpg'

import styles from './style.module.scss'

export default function Applications() {
  return (
    <div className={styles.section}>
      <h2 className={styles.title}>Applications written in Go+</h2>
      <div className={styles.cards}>
        <Card
          title="2D Games"
          pic={gamesPic.src}
          link="https://github.com/goplus/gop#2d-games-powered-by-go"
        />
        <Card
          title="DevOps tools"
          pic={devOpsToolsPic.src}
          link="https://github.com/goplus/gop#devops-tools"
        />
        <Card
          title="Data processing"
          pic={dataProcessingPic.src}
          link="https://github.com/goplus/gop#data-processing"
        />
      </div>
    </div>
  )
}

interface CardProps {
  title: string
  pic: string
  link: string
}

function Card({ pic, title, link }: CardProps) {
  return (
    <a rel="noopener" href={link} className={styles.card}>
      <div className={styles.pic} style={{ backgroundImage: `url("${pic}")` }} />
      <div className={styles.footer}>
        <h4 className={styles.cardTitle}>{title}</h4>
        <IconArrow />
      </div>
    </a>
  )
}

function IconArrow() {
  return (
    <svg className={styles.iconArrow} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.4758 18.228L15.7728 12.916C16.1388 12.549 16.1388 11.956 15.7688 11.588L10.4718 6.27501C10.1088 5.90801 9.51676 5.90801 9.15176 6.27501L8.27476 7.16601C7.90776 7.52901 7.90776 8.12301 8.27476 8.49001L12.0298 12.256L8.27476 16.021C7.90776 16.385 7.90776 16.979 8.27476 17.346L9.15476 18.228C9.51676 18.596 10.1088 18.596 10.4748 18.228H10.4758Z" fill="currentColor"/>
    </svg>
  )
}
