import React, { useCallback, useMemo, useState } from 'react'
import { CodeBlock, github } from 'react-code-blocks'
import Image from 'next/image'
import { CopyToClipboard } from 'react-copy-to-clipboard'

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
  const sourceCode = useMemo(() => getSourceCode(children) || '', [children])
  const onCopy = useCallback((_, result) => {
    setIsCopied(result)
    setTimeout(() => setIsCopied(false), 2500)
  }, [])

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
        <div className={`${styles.copyBtn} ${isCopied ? styles.copyed : ''}`}>
          <Image width={28} height={28} src={isCopied ? '/copy_done.svg' : '/copy_enable.svg'} alt="Copy Icon" />
        </div>
      </CopyToClipboard>
    </div>
  )
}
