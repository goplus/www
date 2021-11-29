import React, { ReactNode, isValidElement } from 'react'

import Code from 'components/Code'

function getSourceCode(element: ReactNode) {
  while (isValidElement(element)) {
    element = element.props.children
  }
  while (Array.isArray(element)) {
    element = element[0]
  }
  return typeof element === 'string' ? element : ''
}

export interface Props {
  className?: string
  children?: ReactNode
}

export default function CodeForMD({ children, className }: Props) {
  const language = className?.slice(9)
  const code = getSourceCode(children)
  return <Code language={language} code={code} />
}
