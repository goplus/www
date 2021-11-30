import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

import TextWrapper from 'components/TextWrapper'
import CodeForMD from 'components/CodeForMD'
import { getText } from 'utils'
import { getAnchorId } from '../common'
import content from '../content.md'
import styles from './style.module.scss'

const components = {
  code: CodeForMD,
  h3: Heading // TODO: maybe all heading elements (h1, h2, h3, ...)?
}

export default function MobileFeatures() {
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>Go+ features</h2>
      <TextWrapper>
        <ReactMarkdown
          components={components}
          rehypePlugins={[rehypeRaw]}
        >{content}</ReactMarkdown>
      </TextWrapper>
    </section>
  )
}

function Heading({ children }: React.PropsWithChildren<{}>) {
  const id = getAnchorId(getText(children))
  return <h3 id={id}>{children}</h3>
}
