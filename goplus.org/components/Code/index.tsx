import React, { useCallback, useMemo, PropsWithChildren, useState } from 'react'
import { CodeBlock, github } from 'react-code-blocks'
import Image from 'next/image'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import hljs from 'highlight.js'

import { useHoverState, useTimer } from '../../hooks'

import styles from './style.module.css'

// TODO: When highlight.js supports goplus, use `gop` instead
const hljsLangForGop = 'go'

// TODO
// hljs.highlight

export interface Props {
  language?: string
  code: string
}

github.backgroundColor = '#FAFAFA'

export default function Code({ code, language = hljsLangForGop }: Props) {
  const [isCopied, setIsCopied] = useState(false)
  const { isHovered, onMouseEnter, onMouseLeave } = useHoverState()
  const timer = useTimer()
  const onCopy = useCallback(
    (_, result) => {
      setIsCopied(result)
      timer.current = setTimeout(() => setIsCopied(false), 2500)
    },
    [timer]
  )

  const copyIconSrc = isCopied ? '/copy_done.svg' : isHovered ? '/copy_hover.svg' : '/copy_enable.svg'

  return (
    <div className={styles.codeBlock}>
      <CodeBlock
        text={code}
        language={language}
        codeBlock
        theme={github}
        showLineNumbers={false}
      />
      <CopyToClipboard text={code} onCopy={onCopy}>
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
