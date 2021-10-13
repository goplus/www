import React from 'react'

import Intro from './Intro'
import Summary from './Summary'
import Features from './Features'
import Layout from '../Layout'

export default function Home({ children }: React.PropsWithChildren<{}>) {
  return (
    <Layout>
      <main>
        <Intro />
        <Summary />
        <Features>{children}</Features>
      </main>
    </Layout>
  )
}
