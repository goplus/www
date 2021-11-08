import React from 'react'

import { useMobile } from '../../hooks'
import PcHeader from './Pc'
import MobileHeader from './Mobile'

export default function Header() {
  if (useMobile()) return <MobileHeader />
  return <PcHeader />
}
