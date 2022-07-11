/**
 * @file (Large) Link Button
 * @desc Usually used in banners or cards, as a conspicuous link with button-like style.
 */

import React, { ReactNode } from 'react'

import { cns } from 'utils'

import styles from './style.module.scss'

export interface Props {
  href: string
  children: ReactNode
  primary?: boolean
  className?: string
}

export default function LinkButton({ href, children, primary = false, className }: Props) {
  const linkClassName = cns(primary ? styles.primaryBtn : styles.btn, className)
  return <a href={href} rel="noopener" className={linkClassName}>{children}</a>
}
