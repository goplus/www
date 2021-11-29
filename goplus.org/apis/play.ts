const playHost = 'https://play.goplus.org'

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
  const resp = await fetch(`${playHost}/compile`, {
    method: 'POST',
    body: new URLSearchParams({
      body,
      withVet: withVet + ''
    })
  })
  return resp.json()
}
