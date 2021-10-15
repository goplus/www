import { createContext, ReactNode } from 'react'

export interface Feature {
  id: string
  title: ReactNode
  heading: HTMLHeadingElement
}

export interface CtxValue {
  features: Feature[]
  registerFeature: (feature: Feature) => void
}

export default createContext<CtxValue>({
  features: [],
  registerFeature: () => {}
})
