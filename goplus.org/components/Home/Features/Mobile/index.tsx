import React from 'react'
import { MDXRemote } from 'next-mdx-remote'

import TextWrapper from '../../../../components/TextWrapper'
import Code from '../../../../components/Code'
import { Props } from '../common'
import styles from './style.module.scss'

const components = {
  code: Code,
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
