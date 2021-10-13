import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import styles from './style.module.css'
import { useHoverState } from '../../hooks'

export default function Nav() {
  const navItems = React.useRef([
    {
      children: 'Overview',
      href: ''
    },
    {
      children: 'Tutorials',
      href: 'https://github.com/goplus/gop#tutorials'
    },
    {
      children: 'Playground',
      href: 'https://github.com/goplus/gop#playground'
    },
    {
      children: 'Contributing',
      href: 'https://github.com/goplus/gop#contributing'
    },
    {
      children: 'IDE Plugins',
      href: 'https://github.com/goplus/gop#ide-plugins'
    }
  ])

  const { isHovered, onMouseEnter, onMouseLeave } = useHoverState()

  return (
    <header className={styles.header}>
      <div className={styles.nav}>
        <Link href="/">
          <a style={{ lineHeight: 1 }}>
            <Image width={60} height={17} src="/go_plus.svg" alt="Go Plus Logo" />
          </a>
        </Link>
        <div className={styles.links}>
          {navItems.current.map((item, index) => (
            <NaviItem className={0 === index ? styles.selected : ''} key={index} {...item} />
          ))}
          <a
            href="https://github.com/goplus/gop"
            rel="noreferrer"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <Image
              width={20}
              height={20}
              src={isHovered ? '/github_hover.svg' : '/github.svg'}
              alt="Github Logo"
            ></Image>
          </a>
        </div>
      </div>
    </header>
  )
}

interface NaviItemProps {
  className?: string
  href: string
}

function NaviItem({ className, href, children }: React.PropsWithChildren<NaviItemProps>) {
  return (
    <a className={`${styles.linkItem} ${className}`} href={href} rel="noreferrer">
      {children}
    </a>
  )
}
