import React, { HTMLAttributes } from 'react'

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

const tutorialCode: CodeSegmentInfo[] = [
  {
    content: `var a [5]int
println "empty:", a`,
    doc: <p>Here we create an array <code>a</code> that will hold exactly 5 <code>int</code>s. The type of elements and length are both part of the array&rsquo;s type. By default an array is zero-valued, which for <code>int</code>s means <code>0</code>s.</p>
  },
  {
    content: `a[4] = 100
println "set:", a
println "get:", a[4]`,
    doc: <p>We can set a value at an index using the <code>array[index] = value</code> syntax, and get a value with <code>array[index]</code>.</p>
  },
  {
    content: `c := [...]int{1, 2, 3}
println c`,
    doc: <p>If you don’t want to write the length of the array, you can use this method and let the compiler calculate the length of the array itself.</p>
  },
]

export default function Dev() {

  if (process.env.NODE_ENV !== 'development') return null

  return (
    <Layout>
      <Centered>
        <Block>
          <CodeEditor code={helloWorldCode} />
        </Block>
        <Block>
          <CodeBlock halfCode code={helloWorldCode} />
        </Block>
        <Block>
          <CodeBlock code={valuesCode} />
        </Block>
        <Block style={{ fontSize: '16px' }}>
          <CodeBlock code={tutorialCode} />
        </Block>
      </Centered>
    </Layout>
  )
}

function Block({ children, style, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div {...rest} style={{ margin: '2em 0', ...style }}>{children}</div>
}
