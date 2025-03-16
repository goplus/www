import { ReactNode } from 'react'
import { getOrigin } from 'utils'

export interface NavItemInfo {
  children: ReactNode
  href: string
  isBlank: boolean
}

export const navItems: NavItemInfo[] = [
  {
    children: 'Overview',
    href: getOrigin(),
    isBlank: false
  },
  {
    children: 'Tutorial',
    href: 'https://tutorial.goplus.org',
    isBlank: false
  },
  {
    children: 'Download',
    href: getOrigin() + '/download',
    isBlank: false
  },
  {
    children: 'Playground',
    href: 'https://play.goplus.org',
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
  },
  {
    children: "Blog",
    href: getOrigin() + "/blog",
    isBlank: false
  },
]
