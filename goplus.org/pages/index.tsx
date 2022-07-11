import React from 'react'

import Layout from 'components/Layout'
import Intro from 'components/Home/Intro'
import KeyFeatures from 'components/Home/KeyFeatures'
import Applications from 'components/Home/Applications'
import Guide from 'components/Home/Guide'

export default function Home() {
  return (
    <Layout>
      <Intro />
      <KeyFeatures />
      <Applications />
      <Guide />
    </Layout>
  )
}
