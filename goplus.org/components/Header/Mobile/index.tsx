import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { NavItemInfo, navItems } from '../common'
import GithubIcon from '../GithubIcon'
import styles from './style.module.scss'

export default function Header() {
  const [expanded, setExpanded] = useState(true)

  function handleExpandBtnClick() {
    setExpanded(v => !v)
  }

  const overlay = expanded && (
    <div className={styles.overlay}>
      {navItems.map((item, i) => <NavItem key={i} {...item} />)}
    </div>
  )

  return (
    <header className={styles.header}>
      <div className={styles.main}>
        <Link href="/">
          <a className={styles.logoLink}>
            <Image width={60} height={17} src="/go_plus.svg" alt="Go Plus Logo" />
          </a>
        </Link>
        <div className={styles.operations}>
          <a href="https://github.com/goplus/gop" className={styles.githubLink}>
            <GithubIcon />
          </a>
          <button className={styles.expandBtn} onClick={handleExpandBtnClick}>
            {expanded ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
      {overlay}
    </header>
  )
}

function NavItem({ children, href }: NavItemInfo) {
  return (
    <li className={styles.navItem}>
      <a className={styles.navLink} href={href} rel="noreferrer">{children}</a>
    </li>
  )
}

function MenuIcon() {
  return (
    <svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <g stroke="none" strokeWidth="1" fillRule="evenodd">
        <g transform="translate(-339.000000, -26.000000)">
          <g id="编组" transform="translate(339.000000, 26.000000)">
            <path d="M18,15 L18,17 L2,17 L2,15 L18,15 Z M18,9 L18,11 L2,11 L2,9 L18,9 Z M18,3 L18,5 L2,5 L2,3 L18,3 Z" id="形状结合"></path>
          </g>
        </g>
      </g>
    </svg>
  )
}

function CloseIcon() {
  return (
    <MenuIcon /> // TODO
  )
}
