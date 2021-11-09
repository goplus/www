import React from 'react'
import Head from 'next/head'

import Header from '../Header'
import Footer from '../Footer'

export interface Props {
  meta?: {
    title?: string
  }
}

export default function Layout({ meta: pageMeta, children }: React.PropsWithChildren<Props>) {
  const meta = {
    title: 'GoPlus - The Go+ language for engineering, STEM education, and data science',
    ...pageMeta
  }

  return (
    <div>
      <Head>
        <title>{meta.title}</title>
        <link rel="icon" href="/go_plus.svg" />
        <meta name="viewport" content="initial-scale=1.0,width=device-width,user-scalable=no"></meta>
      </Head>
      <Header />
      <main>{children}</main>
      <Footer></Footer>
    </div>
  )
}
