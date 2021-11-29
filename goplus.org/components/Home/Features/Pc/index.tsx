import React, { useCallback, useMemo, useState } from 'react'
import { MDXRemote } from 'next-mdx-remote'

import TextWrapper from '../../../../components/TextWrapper'
import Code from '../../../../components/Code'
import { Props } from '../common'
import Aside from './Aside'
import Heading from './Heading'
import featuresCtx, { Feature } from './ctx'

import styles from './style.module.scss'

const components = {
  code: Code,
  h3: Heading
}

export default function PcFeatures({ source }: Props) {
  const [features, setFeatures] = useState<Feature[]>([])

  const registerFeature = useCallback((feature: Feature) => {
    setFeatures(list => {
      const filtered = list.filter(item => item.id !== feature.id)
      return [...filtered, feature].sort((a, b) => a.heading.offsetTop - b.heading.offsetTop)
    })
  }, [])

  const ctxValue = useMemo(() => ({ features, registerFeature }), [features, registerFeature])

  return (
    <featuresCtx.Provider value={ctxValue}>
      <div className={styles.section}>
        <h2 className={styles.title}>Go+ features</h2>
        <div className={styles.content}>
          <Aside />
          <div className={styles.features}>
            <TextWrapper>
              <MDXRemote {...source} components={components} />
            </TextWrapper>
          </div>
        </div>
      </div>
    </featuresCtx.Provider>
  )
}
