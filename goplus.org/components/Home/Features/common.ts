import { MDXRemoteSerializeResult } from 'next-mdx-remote'

export type Source = MDXRemoteSerializeResult

export interface Props {
  source: any // TODO
}

/** Get anchor ID from title */
export function getAnchorId(title: string) {
  return title
    .split(/[^\w\d\s]/, 1)[0]
    .split(/\s+/)
    .map(word => word.toLocaleLowerCase())
    .join('-')
}
