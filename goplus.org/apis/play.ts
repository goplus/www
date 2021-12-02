const host = 'https://play.goplus.org'

export type CompileOptions = {
  body: string
  /** Whether client supports vet response in a /compile request */
  withVet?: boolean
}

export type CompileEvent = {
  /** Time to wait before printing Message */
  Delay: number
  Kind: 'stdout' | 'stderr'
  Message: string
}

export type CompileResult = {
  Errors: string
  Events: CompileEvent[] | null
  IsTest: boolean
  /** Exit Code */
  Status: number
  /** Number of `--- FAIL ...` */
  TestsFailed: number
  /**
   * VetErrors, if non-empty, contains any vet errors. It is
   * only populated if request.WithVet was true.
   */
  VetErrors?: string
  /**
   * VetOK reports whether vet ran & passsed. It is only
   * populated if request.WithVet was true. Only one of
   * VetErrors or VetOK can be non-zero.
   */
  VetOK?: boolean
}

export async function compile({ body, withVet = false }: CompileOptions): Promise<CompileResult> {
  const resp = await fetch(`${host}/compile`, {
    method: 'POST',
    mode: 'cors',
    body: new URLSearchParams({
      body,
      withVet: withVet + ''
    }),
  })
  if (!resp.ok) {
    throw new Error(`Status ${resp.status}`)
  }
  return resp.json()
}

export async function share(code: string) {
  const resp = await fetch(`${host}/share`, {
    method: 'POST',
    mode: 'cors',
    body: code
  })
  if (!resp.ok) {
    throw new Error(`Status ${resp.status}`)
  }
  const hash = await resp.text()
  return `${host}/p/${hash}`
}
