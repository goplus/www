import React from 'react'
import { CopyBlock, dracula } from 'react-code-blocks'

const reg = /```(.+?)\n(.*\n)+?```/m

export interface Props {
  language: string
}

function getSourceCode(element: React.ReactNode) {
  while (React.isValidElement(element)) {
    element = element.props.children
  }
  return typeof element === 'string' ? element : ''
}

export default function Code({ language, children }: React.PropsWithChildren<Props>) {
  return <CopyBlock text={getSourceCode(children) || ''} language={language} codeBlock theme={dracula} />
}
