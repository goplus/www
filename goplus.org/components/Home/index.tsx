import React, { ReactNode } from 'react'

import Intro from './Intro'
import Summary from './Summary'
import Features, { Source as FeaturesSource } from './Features'
import Layout from '../Layout'

export interface Props {
  featuresSource: FeaturesSource
}

export default function Home({ featuresSource }: Props) {
  return (
    <Layout>
      <Intro />
      <Summary />
      <Features source={featuresSource} />
    </Layout>
  )
}
