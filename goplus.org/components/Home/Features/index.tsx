import React from 'react'

import { useMobile } from '../../../hooks'
import PcFeatures from './Pc'
import MobileFeatures from './Mobile'

export default function Features() {
  const isMobile = useMobile()
  if (isMobile) {
    return <MobileFeatures />
  }
  return <PcFeatures />
}
