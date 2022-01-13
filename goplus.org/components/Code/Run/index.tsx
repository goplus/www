/**
 * @file Run result for gop code
 * @desc includes states like running, error, success, etc
 */

import React, { PropsWithChildren, ReactNode, useCallback, useEffect, useRef, useState } from 'react'

import { compile, CompileResult } from 'apis/play'
import { cns } from 'utils'
import IconLoading from 'components/UI/IconLoading'

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
  return (
    <p className={styles.loading} {...restProps}>
      <IconLoading className={styles.iconLoading} />
      {children}
    </p>
  )
}
