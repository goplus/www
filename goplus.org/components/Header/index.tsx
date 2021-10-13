import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import styles from './style.module.css'

export default function Nav() {
  const navItems = React.useRef([
    {
      children: 'Overview',
      href: 'https://github.com/goplus/gop#summary-about-go'
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

  return (
    <header className={styles.header}>
      <div className={styles.nav}>
        <Link href="/">
          <a>
            <Image width={60} height={17} src="/go_plus.svg" alt="Go Plus Logo" />
          </a>
        </Link>
        <div className={styles.links}>
          {navItems.current.map((item, index) => (
            <NaviItem className={0 === index ? styles.selected : ''} key={index} {...item} />
          ))}
          <a href="https://github.com/goplus/gop">
            <Image width={20} height={20} src="/github.svg" alt="Github Logo"></Image>
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
    <a className={`${styles.linkItem} ${className}`} href={href}>
      {children}
    </a>
  )
}
