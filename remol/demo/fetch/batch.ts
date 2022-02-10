import { action, mem, remolFail, remolWaitTimeout } from '@remol/core'

export class RemolDemoFetchBatch<V> extends Object {
  constructor(id: string) {
    super()
    this[Symbol.toStringTag] = id
  }

  [Symbol.toStringTag]: string

  timeout() {
    return 2000
  }

  fetch(patches: Record<string, V | undefined | null>): RemoDemoFetchBatchResponse<V> {
    throw new Error('implement')
  }

  get pending() {
    return this.status() instanceof Promise
  }

  get error() {
    const v = this.status()

    return v instanceof Error ? v : undefined
  }

  @mem(0) status(next?: unknown) {
    return next ?? null
  }

  reset() {}

  @action task(patches: Record<string, V | null | undefined>) {
    try {
      const resp = RemoDemoFetchBatch.response<V>(`${this}#batch`, this.fetch(patches))
      Object.assign(this.output, resp)
      this.status(null)
    } catch (error) {
      this.status(error)
      remolFail(error)
    }
  }

  protected input = {} as Record<string, V | undefined | null>
  protected output = {} as Record<string, V | null>

  schedule() {
    const status = this.status()
    if (status) throw status

    remolWaitTimeout(this.timeout())
    const patches = this.input
    this.input = {}
    this.task(patches)
  }

  request(id: string, v?: V | null) {
    this.input[id] = v

    const data = this.output[id]
    if (data === undefined) this.schedule()
    delete this.output[id]

    return data
  }
}

type RemoDemoFetchBatchResponse<V> = {
  data: Record<string, V>
  errors?: Record<string, RemoDemoFetchBatchErrorDTO>
}

type RemoDemoFetchBatchErrorDTO = {
  code: string
  message?: string
}

export class RemoDemoFetchBatch extends Object {
  constructor(protected input: RequestInfo, protected errors: Record<string, RemoDemoFetchBatchErrorDTO>) {
    super()
  }

  static response<V>(input: RequestInfo, res: RemoDemoFetchBatchResponse<V>) {
    return res.errors ? new Proxy<typeof res.data>(res.data, new RemoDemoFetchBatch(input, res.errors)) : res.data
  }

  get(data: Record<string, unknown>, id: string) {
    const error = this.errors[id]
    if (error === undefined) return data[id]

    throw new Error(`${this.input}: [${id}], ${error.code} (${error.message ?? ''})`)
  }
}
