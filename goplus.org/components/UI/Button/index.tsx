import React, { ReactNode } from 'react'
import { cns } from 'utils'

import styles from './style.module.scss'

interface Props {
  children: ReactNode
  onClick?: () => void
  className?: string
}

export default function Button({ children, className, onClick }: Props) {
  className = cns(styles.button, className)
  return <button className={className} onClick={onClick}>{children}</button>
}
