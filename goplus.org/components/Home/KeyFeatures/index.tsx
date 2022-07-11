import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

import TextWrapper from '../../TextWrapper'

import styles from './style.module.scss'

// Copied from https://github.com/goplus/gop/blob/main/README.md#key-features-of-go
// with doc link address normalized
const content = `
* A static typed language.
* The simplest engineering language that can be mastered by children (script-like style).
* Performance: as fast as Go (Go+'s main backend compiles to human-readable Go).
* Fully compatible with [Go](https://github.com/golang/go) and can mix Go/Go+ code in the same package (see [Go/Go+ hybrid programming](https://github.com/goplus/gop/blob/main/doc/docs.md#gogo-hybrid-programming)).
* No DSL (Domain Specific Language) support, but it's Specific Domain Friendly (see [DSL vs. SDF](https://github.com/goplus/gop/blob/main/doc/dsl-vs-sdf.md)).
* Support Go code generation (main backend) and [bytecode backend](https://github.com/goplus/igop) (REPL: see [iGo+](https://repl.goplus.org/)).
* [Simplest way to interaction with C](https://github.com/goplus/gop/blob/main/doc/docs.md#calling-c-from-go) (cgo is supported but not recommended).
* [Powerful built-in data processing capabilities](https://github.com/goplus/gop/blob/main/doc/docs.md#data-processing).
`

export default function KeyFeatures() {
  return (
    <div className={styles.section}>
      <h2 className={styles.title}>Key Features of Go+</h2>
      <TextWrapper>
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
      </TextWrapper>
    </div>
  )
}
