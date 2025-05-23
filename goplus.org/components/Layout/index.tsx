import React from 'react'
import Head from 'next/head'

import Header from '../Header'
import Footer from '../Footer'

import styles from './style.module.scss'

export interface Props {
  meta?: {
    title?: string
  }
}

export default function Layout({ meta: pageMeta, children }: React.PropsWithChildren<Props>) {
  const meta = {
    title: 'XGo - Enable everyone to become a builder of the world',
    ...pageMeta
  }

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <link rel="icon" href="/favicon.svg" />
        <meta name="viewport" content="initial-scale=1.0,width=device-width,user-scalable=no"></meta>
      </Head>
      <Header />
      <main>{children}</main>
      <Footer className={styles.footer} />
    </>
  )
}
