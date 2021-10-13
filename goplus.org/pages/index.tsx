import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'

import Home from '../components/Home'
import Heading from '../components/Home/Heading'
import { getDoc } from '../lib/docs'
import Code from '../components/Code'
const components = { Code, h3: Heading }

export default function TestPage({ source }: any) {
  return (
    <Home>
      <MDXRemote {...source} components={components} />
    </Home>
  )
}

export async function getStaticProps() {
  // MDX text - can be from a local file, database, anywhere
  const source = getDoc('index.mdx')
  const mdxSource = await serialize(source)
  return { props: { source: mdxSource } }
}
