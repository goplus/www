import React, { useCallback, useState, HTMLAttributes, ReactNode, useRef, useEffect, PropsWithChildren } from 'react'
import { CodeBlock, github } from 'react-code-blocks'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { useTimer } from 'hooks'
import { compile, CompileResult } from 'apis/play'

import styles from './style.module.scss'

const langGop = 'gop'

export interface Props {
  /** Code content */
  code: string
  /** Language of given code */
  language?: string
  /** If code copyable (with a copy button) */
  copyable?: boolean
  /** If code runnable (with a run button) */
  runnable?: boolean
}

github.backgroundColor = '#FAFAFA'

export default function Code({
  code,
  language = langGop,
  copyable = true,
  runnable = true
}: Props) {

  const runResultRef = useRef<HTMLPreElement>(null)
  const [runResult, setRunResult] = useState<ReactNode>(null)

  useEffect(() => {
    runResultRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    })
  }, [runResult])

  runnable = language === langGop && runnable

  const runResultView = runnable && runResult != null && (
    <pre className={styles.runResult} ref={runResultRef}>
      {runResult}
    </pre>
  )

  return (
    <div className={styles.codeBlock}>
      <CodeBlock
        text={code}
        language={language === langGop ? 'go' : language} // `gop` not supported yet
        codeBlock
        theme={github}
        showLineNumbers={false}
      />
      <div className={styles.ops}>
        {copyable && <CopyButton code={code} />}
        {runnable && <RunButton code={code} onResult={setRunResult} />}
      </div>
      {runResultView}
    </div>
  )
}

function CopyButton({ code }: { code: string }) {
  const [isCopied, setIsCopied] = useState(false)
  const timer = useTimer()
  const onCopy = useCallback(
    (_, result) => {
      setIsCopied(result)
      timer.current = setTimeout(() => setIsCopied(false), 2500)
    },
    [timer]
  )

  return (
    <CopyToClipboard text={code} onCopy={onCopy}>
      <Button className={isCopied ? styles.active : undefined} title="Copy Code">
        {isCopied ? <IconOK /> : <IconCopy />}
      </Button>
    </CopyToClipboard>
  )
}

type RunButtonProps = {
  code: string
  onResult: (result: ReactNode) => void
}

function Events({ events }: { events: CompileResult['Events'] }) {
  if (events == null) return <Tip>No output.</Tip>
  return <>{events.map(e => e.Message).join('\n')}</>
}

function ExitStatus({ status }: { status: CompileResult['Status'] }) {
  return <Tip>Program exited with {status}.</Tip>
}

function Tip(props: PropsWithChildren<{}>) {
  return <p className={styles.tip} {...props} />
}

function RunButton({ code, onResult }: RunButtonProps) {

  async function handleClick() {
    onResult(<Tip>Waiting for remote server...</Tip>)
    const result = await compile({ body: code })
    const content = (() => {
      if (result.Errors) {
        return <>
          <Tip>Error encountered:</Tip>
          {result.Errors}
        </>
      }
      return <>
        <Events events={result.Events} />
        <ExitStatus status={result.Status} />
      </>
    })()
    onResult(content)
  }

  return (
    <Button title="Run Code" onClick={handleClick}>
      <IconPlay />
    </Button>
  )
}

function Button({ className, ...restProps }: HTMLAttributes<HTMLButtonElement>) {
  className = [styles.opBtn, className].filter(Boolean).join(' ')
  return <button type="button" className={className} {...restProps} />
}

function IconCopy() {
  return (
    <svg className={styles.copy} width="16" height="16" viewBox="0 0 16 16">
      <g fill="none" fillRule="evenodd">
        <rect stroke="currentColor" x="6.5" y=".5" width="9" height="9" rx="2"/>
        <path fill="currentColor" fillRule="nonzero" d="M5,6 L5,7 L2,7 C1.48716416,7 1.06449284,7.38604019 1.00672773,7.88337887 L1,8 L1,14 C1,14.5128358 1.38604019,14.9355072 1.88337887,14.9932723 L2,15 L8,15 C8.51283584,15 8.93550716,14.6139598 8.99327227,14.1166211 L9,14 L9,11 L10,11 L10,14 C10,15.1045695 9.1045695,16 8,16 L2,16 C0.8954305,16 0,15.1045695 0,14 L0,8 C0,6.8954305 0.8954305,6 2,6 L5,6 Z"/>
      </g>
    </svg>
  )
}

function IconOK() {
  return (
    <svg width="13" height="9" viewBox="0 0 13 9" fill="none">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M1.19675 4.76736L4.73229 8.30289L11.8034 1.23182"/>
    </svg>
  )
}

function IconPlay() {
  return (
    <svg width="11" height="14" viewBox="0 0 11 14" fill="none">
      <path d="M1 1.80385L10 7L1 12.1962V1.80385Z" stroke="currentColor"/>
    </svg>
  )
}
