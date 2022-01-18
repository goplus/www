import React, { ChangeEvent, ReactNode } from 'react'
import { cns } from 'utils'

import styles from './style.module.scss'

interface Props {
  children: ReactNode
  value: string
  onChange: (value: string) => void
  className?: string
}

export default function Select({ children, className, value, onChange }: Props) {

  className = cns(styles.select, className)

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    onChange(e.target.value)
  }

  return (
    <div className={styles.selectWrapper}>
      <select className={className} value={value} onChange={handleChange}>
        {children}
      </select>
    </div>
  )
}

export interface OptionProps {
  value: string
  children: string
}

export function Option(props: OptionProps) {
  return <option {...props} />
}
