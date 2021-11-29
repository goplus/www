import React, { useContext, useEffect, useRef } from 'react'

import { getText } from '../../../../../utils'
import { getAnchorId } from '../../common'
import featuresCtx from '../ctx'

export default function Heading({ children }: React.PropsWithChildren<{}>) {
  const { registerFeature } = useContext(featuresCtx)
  const headingRef = useRef<HTMLHeadingElement>(null)

  const title = getText(children)
  const id = getAnchorId(title)

  useEffect(() => {
    registerFeature({
      id,
      title,
      heading: headingRef.current!
    })
  }, [id, title, registerFeature])

  return (
    <h3 ref={headingRef} data-id={id}>
      {children}
    </h3>
  )
}
