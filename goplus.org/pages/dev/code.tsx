import React, { HTMLAttributes, PropsWithChildren } from 'react'

import Layout from 'components/Layout'
import Centered from 'components/Centered'
import CodeBlock, { CodeSegmentInfo } from 'components/Code/Block'
import CodeEditor from 'components/Code/Editor'

const helloWorldCode = `package main

func main() {
    println("Hello world")
}
`

const valuesCode1 = `println "Go"+"Plus"`

const valuesCode2 = `println "1+1 =", 1+1
println "7.0/3.0 =", 7.0/3.0
`

const valuesCode3 = `println true && false
println true || false
println !true
`

const valuesCode: CodeSegmentInfo[] = [
  {
    content: valuesCode1,
    doc: <p>Strings, which can be added together with <code>+</code>.</p>
  },
  {
    content: valuesCode2,
    doc: <p>Integers and floats.</p>
  },
  {
    content: valuesCode3,
    doc: <p>Booleans, with boolean operators as you’d expect.</p>
  }
]

export default function Dev() {

  if (process.env.NODE_ENV !== 'development') return null

  return (
    <Layout>
      <Centered>
        <Block>
          <CodeEditor code={helloWorldCode} />
        </Block>
        <Block style={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <CodeBlock halfCode code={helloWorldCode} />
        </Block>
        <Block>
          <CodeBlock code={valuesCode} />
        </Block>
      </Centered>
    </Layout>
  )
}

function Block({ children, style, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div {...rest} style={{ margin: '2em 0', ...style }}>{children}</div>
}
