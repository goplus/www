/* eslint-disable @next/next/no-html-link-for-pages */

import React from 'react'

import { useUrl } from 'hooks/url'
import { NavItemInfo, navItems } from '../common'
import GithubIcon from '../GithubIcon'
import Logo from '../../Icon/Logo'
import styles from './style.module.scss'

export default function Nav() {
  return (
    <header className={styles.header}>
      <div className={styles.nav}>
        <a href="/" style={{ lineHeight: 1 }}>
          <Logo />
        </a>
        <div className={styles.links}>
          {navItems.map((item, index) => (
            <NavItem key={index} {...item} />
          ))}
          <a className={styles.githubLink} href="https://github.com/goplus/gop" rel="noreferrer">
            <GithubIcon />
          </a>
        </div>
      </div>
    </header>
  )
}

function NavItem({ href, children }: NavItemInfo) {
  const url = useUrl()
  const selected = url != null && url.startsWith(href)
  return (
    <a className={`${styles.linkItem} ${selected ? styles.selected : ''}`} href={href} rel="noreferrer">
      {children}
    </a>
  )
}
