/**
 * @file Code Editor for GoPlus (with "Run" button)
 * @desc Edit & run gop code
 */

import React, { useEffect, useRef, useState } from 'react'
import Editor, { EditorProps, Monaco } from '@monaco-editor/react'
import { editor } from 'monaco-editor/esm/vs/editor/editor.api'

import { cns } from 'utils'
import { useMobile } from 'hooks'
import Button from 'components/UI/Button'
import { useCodeRun, RunResult } from '../Run'
import IconLoading from '../IconLoading'
import styles from './style.module.scss'

function getMonacoOptions(isMobile: boolean) {
  const scrollbarSize = isMobile ? 4 : 8
  const monacoOptions: EditorProps['options'] = {
    lineNumbers: 'off',
    fontSize: 16,
    minimap: { enabled: false },
    folding: false,
    lineDecorationsWidth: 0,
    scrollbar: {
      vertical: 'auto',
      horizontalScrollbarSize: scrollbarSize,
      verticalScrollbarSize: scrollbarSize
    },
    overviewRulerLanes: 0
  }
  return monacoOptions
}

const theme: editor.IStandaloneThemeData = {
  base: 'vs',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#FFFFE0',
    'editor.lineHighlightBackground': '#b8b5ae18'
  }
}

export interface Props {
  code: string
  runImmediately?: boolean
  className?: string
  editorClassName?: string
}

export default function CodeEditor({
  code: codeFromProps,
  runImmediately = false,
  className,
  editorClassName
}: Props) {
  const isMobile = useMobile()
  const [code, setCode] = useState(codeFromProps)
  useEffect(() => setCode(codeFromProps), [codeFromProps])

  const { result, run } = useCodeRun(code)
  const [editorReady, setEditorReady] = useState(false)
  const hasRunResult = result != null

  const runImmediatelyRef = useRef(runImmediately)
  runImmediatelyRef.current = runImmediately
  const runRef = useRef(run)
  runRef.current = run
  useEffect(() => {
    if (runImmediatelyRef.current) runRef.current()
  }, [code])

  className = cns(
    styles.wrapper,
    hasRunResult && styles.hasRunResult,
    editorReady && styles.editorReady,
    className
  )

  function handleEditorMount(_: unknown, monaco: Monaco) {
    const themeName = 'gop'
    monaco.editor.defineTheme(themeName, theme)
    monaco.editor.setTheme(themeName)
    setEditorReady(true)
  }

  return (
    <div className={className} style={{ '--editor-background': '#FFFFE0' } as any}>
      <Editor
        className={cns(styles.editor, editorClassName)}
        language="go" // TODO
        value={code}
        onChange={v => setCode(v ?? '')}
        options={getMonacoOptions(isMobile)}
        onMount={handleEditorMount}
        loading=""
      />
      <div className={cns(styles.editorLoading, editorClassName)}>
        <IconLoading className={styles.iconLoading} />
        Loading Editor...
      </div>
      <RunResult result={result} autoScroll={false} />
      <div className={styles.footer}>
        <Button onClick={run}>Run</Button>
      </div>
    </div>
  )
}
