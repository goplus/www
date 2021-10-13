import React, { useCallback, useMemo, useState } from 'react'

import Aside from '../Aside'
import featuresCtx, { Feature } from './ctx'

import styles from './style.module.css'

export default function Features({ children }: React.PropsWithChildren<{}>) {
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
        <div className={styles.title}>Go+ features</div>
        <div className={styles.content}>
          <Aside />
          <div className={styles.features}>{children}</div>
        </div>
      </div>
    </featuresCtx.Provider>
  )
}
