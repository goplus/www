import React, { ReactNode } from 'react'
import { cns } from 'utils'
import IconLoading from '../IconLoading'

import styles from './style.module.scss'

interface Props {
  children: ReactNode
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  className?: string
}

export default function Button({
  children,
  className,
  disabled = false,
  loading = false,
  onClick
}: Props) {
  disabled = disabled || loading
  className = cns(styles.button, disabled && styles.disabled, className)
  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      {loading && <IconLoading className={styles.iconLoading} />}
      {children}
    </button>
  )
}
