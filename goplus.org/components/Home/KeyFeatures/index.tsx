import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

import TextWrapper from '../../TextWrapper'

import styles from './style.module.scss'

// Copied from https://github.com/goplus/gop/blob/main/README.md#key-features-of-go
// with doc link address normalized
const content = `
* Approaching natural language expression and intuitive (see [How XGo simplifies Go's expressions](https://github.com/goplus/gop/blob/main/README.md#how-go-simplifies-gos-expressions)).
* Smallest but Turing-complete syntax set in best practices (see [The XGo Mini Specification](https://github.com/goplus/gop/blob/main/doc/spec-mini.md)).
* Fully compatible with [Go](https://github.com/golang/go) and can mix Go/XGo code in the same package (see [The XGo Full Specification](https://github.com/goplus/gop/blob/main/doc/spec.md) and [Go/XGo Hybrid Programming](https://github.com/goplus/gop/blob/main/doc/docs.md#gogo-hybrid-programming)).
* Integrating with the C ecosystem including Python and providing limitless possibilities based on [LLGo](https://github.com/goplus/llgo) (see [Importing C/C++ and Python libraries](https://github.com/goplus/gop/blob/main/README.md#importing-cc-and-python-libraries)).
* Does not support DSL (Domain-Specific Languages), but supports SDF (Specific Domain Friendliness) (see [XGo Classfiles](https://github.com/goplus/gop/blob/main/doc/classfile.md) and [Domain Text Literal](https://github.com/goplus/gop/blob/main/doc/domian-text-lit.md)).
`

export default function KeyFeatures() {
  return (
    <div className={styles.section}>
      <h2 className={styles.title}>Key Features of XGo</h2>
      <TextWrapper>
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
      </TextWrapper>
    </div>
  )
}
