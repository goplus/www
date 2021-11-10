import React from 'react'

import { useMobile } from '../../../hooks'
import { Source, Props } from './common'
import PcFeatures from './Pc'
import MobileFeatures from './Mobile'

export type { Source, Props }

export default function Features(props: Props) {
  const isMobile = useMobile()
  if (isMobile) {
    return <MobileFeatures {...props} />
  }
  return <PcFeatures {...props} />
}
