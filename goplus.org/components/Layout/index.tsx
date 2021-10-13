import React from 'react'
import Head from 'next/head'

import Header from '../Header'
import styles from './style.module.css'
import Footer from '../Footer'

export interface Props {
  meta?: {
    title?: string
  }
}

export default function Layout({ meta: pageMeta, children }: React.PropsWithChildren<Props>) {
  const meta = {
    title: 'Go Plus Language',
    ...pageMeta
  }

  return (
    <div>
      <Head>
        <title>{meta.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>{children}</main>
      <Footer></Footer>
    </div>
  )
}
