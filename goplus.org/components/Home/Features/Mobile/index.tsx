import React from 'react'
import { MDXRemote } from 'next-mdx-remote'

import TextWrapper from '../../../../components/TextWrapper'
import Code from '../../../../components/Code'
import { getAnchorId, Props } from '../common'
import styles from './style.module.scss'
import { getText } from '../../../../utils'

const components = {
  code: Code,
  h3: Heading // TODO: maybe all heading elements (h1, h2, h3, ...)?
}

export default function MobileFeatures({ source }: Props) {
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>Go+ features</h2>
      <TextWrapper>
        <MDXRemote {...source} components={components} />
      </TextWrapper>
    </section>
  )
}

function Heading({ children }: React.PropsWithChildren<{}>) {
  const id = getAnchorId(getText(children))
  return <h3 id={id}>{children}</h3>
}
