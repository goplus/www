import { ReactNode } from 'react'

export interface NavItemInfo {
  children: ReactNode
  href: string
}

export const navItems: NavItemInfo[] = [
  {
    children: 'Overview',
    href: '/'
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
]
