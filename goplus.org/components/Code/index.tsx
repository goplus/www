import React, { useCallback, useMemo, useRef, useState } from 'react'
import { CodeBlock, github } from 'react-code-blocks'
import Image from 'next/image'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { useTimer } from '../../hooks'

import styles from './style.module.css'

export interface Props {
  className?: string
}

function getSourceCode(element: React.ReactNode) {
  while (React.isValidElement(element)) {
    element = element.props.children
  }
  return typeof element === 'string' ? element : ''
}

github.backgroundColor = '#FAFAFA'

export default function Code({ children, className }: React.PropsWithChildren<Props>) {
  const [isCopied, setIsCopied] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const sourceCode = useMemo(() => getSourceCode(children) || '', [children])
  const timer = useTimer()
  const onCopy = useCallback(
    (_, result) => {
      setIsCopied(result)
      timer.current = setTimeout(() => setIsCopied(false), 2500)
    },
    [timer]
  )

  const onMouseEnter = useCallback(() => setIsHovered(true), [])

  const onMouseLeave = useCallback(() => setIsHovered(false), [])

  const copyIconSrc = isCopied ? '/copy_done.svg' : isHovered ? '/copy_hover.svg' : '/copy_enable.svg'

  return (
    <div className={styles.codeBlock}>
      <CodeBlock
        text={sourceCode}
        language={(className || '').slice(9)} // markdown 解析出来是 `language-xxx`
        codeBlock
        theme={github}
        showLineNumbers={false}
      />
      <CopyToClipboard text={sourceCode} onCopy={onCopy}>
        <div
          className={`${styles.copyBtn} ${isCopied ? styles.copyed : ''}`}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <Image width={28} height={28} src={copyIconSrc} alt="Copy Icon" />
        </div>
      </CopyToClipboard>
    </div>
  )
}
