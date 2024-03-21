import { ReactNode } from 'react'

export interface NavItemInfo {
  children: ReactNode
  href: string
  isBlank: boolean
}

export const navItems: NavItemInfo[] = [
  {
    children: 'Overview',
    href: 'https://goplus.org',
    isBlank: false
  },
  {
    children: 'Tutorial',
    href: 'https://tutorial.goplus.org',
    isBlank: false
  },
  {
    children: 'Download',
    href: 'www-git-fork-jaamiezheng-master-goplus.vercel.app/download',
    isBlank: false
  },
  {
    children: 'Playground',
    href: 'https://play.goplus.org/',
    isBlank: true
  },
  {
    children: 'Contributing',
    href: 'https://github.com/goplus/gop#contributing',
    isBlank: true
  },
  {
    children: 'IDE Plugins',
    href: 'https://github.com/goplus/gop#ide-plugins',
    isBlank: true
  }
]
