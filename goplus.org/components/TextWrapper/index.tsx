/**
 * @file component TextWrapper
 * @desc Wrapper for text content (usually HTML content converted from Markdown),
 *       it provides some built-in style for main HTML tags
 */

import React, { ReactNode } from 'react'

import styles from './style.module.scss'

export interface Props {
  children: ReactNode
}

export default function TextWrapper({ children }: Props) {
  return <div className={styles.wrapper}>{children}</div>
}
