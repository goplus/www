/**
 * @file Code Editor for GoPlus
 * @desc Edit & run gop code
 */

import React, { useEffect, useState } from 'react'
import Editor, { EditorProps, Monaco } from '@monaco-editor/react'
import { editor } from 'monaco-editor/esm/vs/editor/editor.api'

import { cns } from 'utils'
import Button from 'components/UI/Button'
import { useCodeRun, RunResult } from '../Run'
import styles from './style.module.scss'

const monacoOptions: EditorProps['options'] = {
  lineNumbers: 'off',
  fontSize: 16,
  minimap: { enabled: false },
  folding: false,
  lineDecorationsWidth: 0,
  scrollbar: { vertical: 'hidden' },
  overviewRulerLanes: 0
}

const theme: editor.IStandaloneThemeData = {
  base: 'vs',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#FFFFE0',
    'editor.lineHighlightBackground': '#FFFFE0'
  }
}

export interface Props {
  code: string
  className?: string
}

export default function CodeEditor({ code: codeFromProps, className }: Props) {
  const [code, setCode] = useState(codeFromProps)
  useEffect(() => setCode(codeFromProps), [codeFromProps])

  const { result, run } = useCodeRun(code)
  const [editorReady, setEditorReady] = useState(false)
  const hasRunResult = result != null

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
        className={styles.editor}
        language="go" // TODO
        value={code}
        onChange={v => setCode(v ?? '')}
        options={monacoOptions}
        onMount={handleEditorMount}
        loading=""
      />
      <div className={styles.editorLoading}>Loading Editor...</div>
      <RunResult result={result} />
      <div className={styles.footer}>
        <Button onClick={run}>Run</Button>
      </div>
    </div>
  )
}
