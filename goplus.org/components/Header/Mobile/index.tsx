import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { NavItemInfo, navItems } from '../common'
import GithubIcon from '../GithubIcon'
import styles from './style.module.scss'

export default function Header() {
  const [expanded, setExpanded] = useState(false)

  function handleExpandBtnClick() {
    setExpanded(v => !v)
  }

  const overlay = (
    <div className={[styles.overlay, expanded && styles.visible].filter(Boolean).join(' ')}>
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
            <CloseIcon visible={expanded} />
            <MenuIcon visible={!expanded} />
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

interface OperationIconProps {
  visible: boolean
}

function MenuIcon({ visible }: OperationIconProps) {
  return (
    <svg className={visible ? undefined : styles.invisible} width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M18,15 L18,17 L2,17 L2,15 L18,15 Z M18,9 L18,11 L2,11 L2,9 L18,9 Z M18,3 L18,5 L2,5 L2,3 L18,3 Z" fillRule="evenodd"/>
    </svg>
  )
}

function CloseIcon({ visible }: OperationIconProps) {
  return (
    <svg className={visible ? undefined : styles.invisible} width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.3137085,3.3137085 L12.3137085,10.3137085 L19.3137085,10.3137085 L19.3137085,12.3137085 L12.3137085,12.3137085 L12.3137085,19.3137085 L10.3137085,19.3137085 L10.3137085,12.3137085 L3.3137085,12.3137085 L3.3137085,10.3137085 L10.3137085,10.3137085 L10.3137085,3.3137085 L12.3137085,3.3137085 Z" transform="rotate(45 10.828 12.485)" fillRule="evenodd"/>
    </svg>
  )
}
