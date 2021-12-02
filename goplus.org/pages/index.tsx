import React from 'react'

import Layout from 'components/Layout'
import Intro from 'components/Home/Intro'
import Summary from 'components/Home/Summary'
import Features from 'components/Home/Features'

export default function Home() {
  return (
    <Layout>
      <Intro />
      <Summary />
      <Features />
    </Layout>
  )
}
