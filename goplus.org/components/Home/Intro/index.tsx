import React, { useState } from 'react'

import Logo from 'components/Icon/Logo'
import CodeEditor from 'components/Code/Editor'
import Select, { Option } from 'components/UI/Select'
import LinkButton from 'components/UI/LinkButton'
import { getOrigin } from 'utils'

import examples from './examples'
import styles from './style.module.scss'

export default function Intro() {
  return (
    <div className={styles.section}>
      <div className={styles.logo}>
        <Logo />
      </div>
      <div className={styles.slogan}>XGo = C * Go * Python * JS + Scratch</div>
      <div className={styles.btnsWrap}>
        <LinkButton primary href="https://github.com/goplus/gop/blob/main/doc/docs.md">
          Get Started <IconArrowRight />
        </LinkButton>
        <LinkButton href={getOrigin() + '/download'}>
          Download
        </LinkButton>
      </div>
      <h2 className={styles.title}>Try XGo</h2>
      <CodeExamples />
    </div>
  )
}

function CodeExamples() {
  const [codeName, setCodeName] = useState(examples[0].name)
  const code = examples.find(e => e.name === codeName)?.code ?? ''

  const codeSelect = (
    <Select value={codeName} onChange={setCodeName}>
      {examples.map(({ name }) => (
        <Option key={name} value={name}>{name}</Option>
      ))}
    </Select>
  )

  return (
    <CodeEditor
      className={styles.codeEditorWrapper}
      editorClassName={styles.codeEditor}
      code={code}
      runImmediately
      footerExtra={codeSelect}
    />
  )
}

function IconArrowRight() {
  return (
    <svg className={styles.iconArrowRight} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.07031 2.78613C6.79688 3.05957 6.82422 3.46973 7.07031 3.74316L10.3789 6.86035H2.53125C2.14844 6.86035 1.875 7.16113 1.875 7.5166V8.3916C1.875 8.77441 2.14844 9.04785 2.53125 9.04785H10.3789L7.07031 12.1924C6.82422 12.4658 6.82422 12.876 7.07031 13.1494L7.67188 13.751C7.94531 13.9971 8.35547 13.9971 8.60156 13.751L13.9336 8.41895C14.1797 8.17285 14.1797 7.7627 13.9336 7.48926L8.60156 2.18457C8.35547 1.93848 7.94531 1.93848 7.67188 2.18457L7.07031 2.78613Z" fill="currentColor"/>
    </svg>
  )
}
