import { InferGetStaticPropsType } from 'next'
import { serialize } from 'next-mdx-remote/serialize'

import Home from '../components/Home'
import { readDoc } from '../lib/doc'

export default function HomePage({ featuresSource }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <Home featuresSource={featuresSource} />
}

export async function getStaticProps() {
  const featuresContent = readDoc('features.mdx')
  const featuresSource = await serialize(featuresContent)
  return { props: { featuresSource } }
}
