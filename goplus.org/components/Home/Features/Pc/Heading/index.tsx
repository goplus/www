import React, { useContext, useEffect, useRef } from 'react'

import { getText } from '../../../../../utils'
import featuresCtx from '../ctx'

function computedAnchor(title: string) {
  return title
    .split(/[^\w\d\s]/, 1)[0]
    .split(/\s+/)
    .map(word => word.toLocaleLowerCase())
    .join('-')
}

export default function Heading({ children }: React.PropsWithChildren<{}>) {
  const { registerFeature } = useContext(featuresCtx)
  const headingRef = useRef<HTMLHeadingElement>(null)

  const id = computedAnchor(getText(children))

  useEffect(() => {
    registerFeature({
      id,
      title: children,
      heading: headingRef.current!
    })
  }, [id, children, registerFeature])

  return (
    <h3 ref={headingRef} data-id={id}>
      {children}
    </h3>
  )
}
