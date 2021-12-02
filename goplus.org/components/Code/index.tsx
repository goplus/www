import React, { useCallback, useState, ReactNode, useRef, useEffect, PropsWithChildren, ButtonHTMLAttributes } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import syntaxHighlightStyle from './syntax-highlight-style'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { useTimer } from 'hooks'
import { compile, CompileResult, share } from 'apis/play'

import styles from './style.module.scss'

const langGop = 'gop'

// `gop|raw` means language: `gop`, while not interactive (runnable / editable)
const tagRaw = 'raw'

export type CodeSegmentInfo = {
  /** Code content */
  content: string
  /** Corresponding document for the code content */
  doc?: ReactNode
}

export interface Props {
  /** Code */
  code: string | CodeSegmentInfo[]
  /** Language of given code, language with tag (`gop|raw`) is also supported */
  language?: string
  /** If code copyable (with a copy button) */
  copyable?: boolean
  /** If code runnable (with a run button) */
  runnable?: boolean
  /** If code editable (with a edit button navigating to playground) */
  editable?: boolean
}

export default function Code({
  code,
  language = langGop,
  copyable = true,
  runnable = true,
  editable = true
}: Props) {

  const codeSegments = Array.isArray(code) ? code : [{ content: code }]
  const codeText = codeSegments.map(({ content }) => content).join('\n')
  const hasDoc = codeSegments.some(seg => seg.doc != null)

  const runResultRef = useRef<HTMLPreElement>(null)
  const [runResult, setRunResult] = useState<ReactNode>(null)

  useEffect(() => {
    runResultRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    })
  }, [runResult])

  const [lang, tag] = language.split('|')
  const interactive = lang === langGop && tag !== tagRaw

  runnable = interactive && runnable
  editable = interactive && editable

  const runResultView = runnable && runResult != null && (
    <pre className={styles.runResult} ref={runResultRef}>
      {runResult}
    </pre>
  )

  const className = [
    styles.wrapper,
    hasDoc && styles.hasDoc
  ].filter(Boolean).join(' ')

  const opBtns = [
    copyable && <CopyButton key="copy" code={codeText} />,
    runnable && <RunButton key="run" code={codeText} onResult={setRunResult} />,
    editable && <EditButton key="edit" code={codeText} />,
  ].filter(Boolean)

  return (
    <div className={className}>
      <div className={styles.codeSegments}>
        {codeSegments.map((seg, i) => (
          <CodeSegment key={i} language={lang} hasDoc={hasDoc} {...seg} />
        ))}
      </div>
      {opBtns.length > 0 && (
        <div className={styles.ops}>{opBtns}</div>
      )}
      {runResultView}
    </div>
  )
}

type CodeSegmentProps = CodeSegmentInfo & {
  language: string
  /** If doc exists in the whole `CodeBlock` (not just this segment) */
  hasDoc: boolean
}

function CodeSegment({ content, doc, language, hasDoc }: CodeSegmentProps) {
  return (
    <article className={styles.codeSegment}>
      {hasDoc && <aside className={styles.doc}>{doc}</aside>}
      <SyntaxHighlighter
        className={styles.code}
        language={language === langGop ? 'go' : language} // `gop` not supported yet
        showLineNumbers={false}
        useInlineStyles
        style={syntaxHighlightStyle}
        PreTag="p"
      >{content.trim()}</SyntaxHighlighter>
    </article>
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
      <Button highlight={isCopied} title="Copy Code">
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

function EventsWithStatus({ result }: { result: CompileResult }) {
  return <>
    <Events events={result.Events} />
    <ExitStatus status={result.Status} />
  </>
}

function Tip(props: PropsWithChildren<{}>) {
  return <p className={styles.tip} {...props} />
}

function Error({ message }: { message: string }) {
  return <>
    <Tip>Error encountered:</Tip>
    <p className={styles.error}>{message}</p>
  </>
}

function RunButton({ code, onResult }: RunButtonProps) {

  const [loading, setLoading] = useState(false)

  function startWaiting() {
    setLoading(true)
    onResult(<Tip>Waiting for remote server...</Tip>)
  }

  function endWaiting(result: ReactNode) {
    setLoading(false)
    onResult(result)
  }

  async function handleClick() {
    startWaiting()

    let result: CompileResult
    try {
      result = await compile({ body: code })
    } catch (e: unknown) {
      const message = `Request failed: ${e && (e as any).message || 'Unkown'}`
      endWaiting(<Error message={message} />)
      return
    }
    endWaiting(
      result.Errors
      ? <Error message={result.Errors} />
      : <EventsWithStatus result={result} />
    )
  }

  return (
    <Button title="Run Code" onClick={handleClick} loading={loading}>
      <IconPlay />
    </Button>
  )
}

function EditButton({ code }: { code: string }) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    let url: string
    setLoading(true)
    try {
      url = await share(code)
    } catch (e: unknown) {
      // TODO: deal with error
      return
    } finally {
      setLoading(false)
    }
    window.open(url, 'goplus-playground')
  }

  return (
    <Button
      title="Edit Code In Playground"
      onClick={handleClick}
      loading={loading}
    >
      <IconEdit />
    </Button>
  )
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
  highlight?: boolean
}

function Button({ className, loading, highlight, disabled, ...restProps }: ButtonProps) {
  className = [
    styles.opBtn,
    highlight && styles.highlight,
    loading && styles.loading,
    className
  ].filter(Boolean).join(' ')
  disabled = disabled || loading
  return <button type="button" className={className} disabled={disabled} {...restProps} />
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

function IconEdit() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16">
      <path fill="currentColor" d="M7.875,1.75 C7.94375,1.75 8,1.80625 8,1.875 L8,1.875 L8,2.75 C8,2.81875 7.94375,2.875 7.875,2.875 L7.875,2.875 L2.875,2.875 L2.875,13.125 L13.125,13.125 L13.125,8.125 C13.125,8.05625 13.18125,8 13.25,8 L13.25,8 L14.125,8 C14.19375,8 14.25,8.05625 14.25,8.125 L14.25,8.125 L14.25,13.75 C14.25,14.0265625 14.0265625,14.25 13.75,14.25 L13.75,14.25 L2.25,14.25 C1.9734375,14.25 1.75,14.0265625 1.75,13.75 L1.75,13.75 L1.75,2.25 C1.75,1.9734375 1.9734375,1.75 2.25,1.75 L2.25,1.75 Z M12.1828125,1.75 C12.215625,1.75 12.246875,1.7609375 12.271875,1.7859375 L12.271875,1.7859375 L14.2140625,3.7265625 C14.2625,3.775 14.2625,3.8546875 14.2140625,3.903125 L14.2140625,3.903125 L7.715625,10.3875 C7.69375,10.409375 7.6625,10.421875 7.63125,10.4234375 L7.63125,10.4234375 L5.7875,10.46875 C5.6421875,10.46875 5.5296875,10.3546875 5.53123392,10.215625 L5.53123392,10.215625 L5.5609375,8.3578125 C5.5609375,8.325 5.575,8.29375 5.596875,8.2703125 L5.596875,8.2703125 L12.09375,1.7859375 C12.11875,1.7625 12.15,1.75 12.1828125,1.75 Z M12.1828125,3.109375 L6.553125,8.7265625 L6.5421875,9.4515625 L7.25625,9.434375 L12.8890625,3.8140625 L12.1828125,3.109375 Z"></path>
    </svg>
  )
}
