export type RemoDemoFetchBatchResponse<V> = {
  data: Record<string, V>
  errors?: Record<string, RemoDemoFetchBatchErrorDTO>
}

export type RemoDemoFetchBatchErrorDTO = {
  code: string
  message?: string
}

export class RemoDemoFetchBatchError extends Error {
  readonly dto: RemoDemoFetchBatchErrorDTO | undefined

  constructor(p: { id: string; input: RequestInfo; dto: RemoDemoFetchBatchErrorDTO }) {
    super(`${p.input}: [${p.id}], ${p.dto.code} (${p.dto.message ?? ''})`)
    this.dto = p?.dto
  }

  get code() {
    return this.dto?.code
  }
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

    throw new RemoDemoFetchBatchError({ id, dto: error, input: this.input })
  }
}
