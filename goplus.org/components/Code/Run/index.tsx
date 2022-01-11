/**
 * @file Run result for gop code
 * @desc includes states like running, error, success, etc
 */

import React, { PropsWithChildren, ReactNode, useCallback, useEffect, useRef, useState } from 'react'

import { compile, CompileResult } from 'apis/play'
import { cns } from 'utils'

import styles from './style.module.scss'

export interface Props {
  result: ReactNode
  autoScroll?: boolean
  className?: string
}

/** Display run result for gop code */
export function RunResult({
  result,
  autoScroll = true,
  className
}: Props) {
  const runResultRef = useRef<HTMLPreElement>(null)

  const autoScrollRef = useRef(autoScroll)
  autoScrollRef.current = autoScroll

  useEffect(() => {
    if (!autoScrollRef.current) return
    runResultRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    })
  }, [result])

  if (result == null) return null

  return (
    <pre className={cns(styles.runResult, className)} ref={runResultRef}>
      {result}
    </pre>
  )
}

/** Control running process of gop code & outputs result */
export function useCodeRun(code: string) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ReactNode | null>(null)

  function startWaiting() {
    setLoading(true)
    setResult(<Loading>Waiting for remote server...</Loading>)
  }

  function endWaiting(result: ReactNode) {
    setLoading(false)
    setResult(result)
  }

  const run = useCallback(async () => {
    startWaiting()

    let result: CompileResult
    try {
      result = await compile({ body: code })
    } catch (e: unknown) {
      const message = `Request failed: ${e && (e as any).message || 'Unkown'}`
      endWaiting(<Error>{message}</Error>)
      return
    }
    endWaiting(
      result.Errors
      ? <>
        <Error>Error encountered:</Error>
        <p>{result.Errors}</p>
      </>
      : <EventsWithStatus result={result} />
    )
  }, [code])

  return {
    loading,
    result,
    run
  }
}

function Events({ events }: { events: CompileResult['Events'] }) {
  if (events == null) return <Warning>No output.</Warning>
  return <p>{events.map(e => e.Message).join('\n')}</p>
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

function Warning(props: PropsWithChildren<{}>) {
  return <p className={styles.warning} {...props} />
}

function Error(props: PropsWithChildren<{}>) {
  return <p className={styles.error} {...props}></p>
}

function Loading({ children, ...restProps }: PropsWithChildren<{}>) {
  return <p className={styles.loading} {...restProps}><IconLoading />{children}</p>
}

function IconLoading() {
  return (
    <svg className={styles.iconLoading} width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path fill="currentColor" d="M7 0C5.20959 -2.13505e-08 3.48723 0.686046 2.18714 1.91705C0.887058 3.14805 0.108084 4.83042 0.0104217 6.61817C-0.0872405 8.40592 0.503834 10.1631 1.66209 11.5284C2.82034 12.8937 4.45772 13.7633 6.23748 13.9583C8.01724 14.1534 9.80408 13.659 11.2305 12.577C12.657 11.4949 13.6146 9.90742 13.9064 8.14095C14.1982 6.37448 13.8021 4.56333 12.7994 3.07999C11.7968 1.59664 10.2639 0.553873 8.51597 0.166127L8.28858 1.19121C9.77431 1.52079 11.0773 2.40715 11.9295 3.66799C12.7818 4.92883 13.1185 6.4683 12.8704 7.96981C12.6224 9.47131 11.8084 10.8207 10.5959 11.7404C9.38346 12.6602 7.86465 13.0804 6.35185 12.9146C4.83906 12.7488 3.44729 12.0097 2.46277 10.8492C1.47826 9.68866 0.975845 8.19503 1.05886 6.67544C1.14187 5.15586 1.804 3.72584 2.90907 2.67949C4.01414 1.63314 5.47815 1.05 7 1.05V0Z"/>
    </svg>
  )
}
