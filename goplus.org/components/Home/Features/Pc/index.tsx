import React, { useCallback, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

import TextWrapper from 'components/TextWrapper'
import CodeForMD from 'components/CodeForMD'
import content from '../content.md'
import Aside from './Aside'
import Heading from './Heading'
import featuresCtx, { Feature } from './ctx'

import styles from './style.module.scss'

const components = {
  // TODO: performance issue here
  code: CodeForMD,
  h3: Heading
}

export default function PcFeatures() {
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
              <ReactMarkdown
                components={components}
                rehypePlugins={[rehypeRaw]}
              >{content}</ReactMarkdown>
            </TextWrapper>
          </div>
        </div>
      </div>
    </featuresCtx.Provider>
  )
}
