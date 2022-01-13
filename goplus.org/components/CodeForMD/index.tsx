import React, { ReactNode, isValidElement, Children } from 'react'

import CodeBlock from 'components/Code/Block'

export interface Props {
  inline?: boolean
  className?: string
  children?: ReactNode
}

export default function CodeForMD({ inline = false, children, className }: Props) {
  if (inline) {
    return <code>{children}</code>
  }
  const language = getLang(className)
  const code = getSourceCode(children)
  return <CodeBlock language={language} code={code} />
}

const classNamePattern = /^language-(.*)$/

function getLang(className: string | undefined) {
  if (className == null) return undefined
  const matched = classNamePattern.exec(className)
  if (matched == null) return undefined
  return matched[1]
}

function getSourceCode(children: ReactNode) {
  const sources = Children.map(children, element => {
    while (isValidElement(element)) {
      element = element.props.children
    }
    return typeof element === 'string' ? element : ''
  })
  return (sources || []).join('')
}
