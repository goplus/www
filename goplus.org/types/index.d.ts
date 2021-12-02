declare module '*.md' {
  const content: string
  export default content
}

declare module 'moveto' {
  export type Options = {
    duration?: number
    container?: Window | HTMLElement
  }

  export class MoveTo extends IMoveTo {
    constructor(options?: Options)

    move(target: HTMLElement | number, options?: Options): void
  }

  export default MoveTo
}
