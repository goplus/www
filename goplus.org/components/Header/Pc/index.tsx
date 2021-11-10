import React, { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { NavItemInfo, navItems } from '../common'
import GithubIcon from '../GithubIcon'
import styles from './style.module.scss'

export default function Nav() {
  return (
    <header className={styles.header}>
      <div className={styles.nav}>
        <Link href="/">
          <a style={{ lineHeight: 1 }}>
            <Image width={60} height={17} src="/go_plus.svg" alt="Go Plus Logo" />
          </a>
        </Link>
        <div className={styles.links}>
          {navItems.map((item, index) => (
            <NavItem className={0 === index ? styles.selected : ''} key={index} {...item} />
          ))}
          <a className={styles.githubLink} href="https://github.com/goplus/gop" rel="noreferrer">
            <GithubIcon />
          </a>
        </div>
      </div>
    </header>
  )
}

interface NavItemProps extends NavItemInfo {
  className?: string
}

function NavItem({ className, href, children }: NavItemProps) {
  return (
    <a className={`${styles.linkItem} ${className}`} href={href} rel="noreferrer">
      {children}
    </a>
  )
}
