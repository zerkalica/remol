export type RemoDemoFetchBatchResponse<V> = {
  data: Record<string, V>
  errors?: Record<string, RemoDemoFetchBatchErrorDTO>
}

export type RemoDemoFetchBatchErrorDTO = {
  code: string
  message?: string
}

export class RemoDemoFetchBatchError extends Error {
  readonly cause: RemoDemoFetchBatchErrorDTO | undefined

  constructor(p: { id: string; input: RequestInfo; cause: RemoDemoFetchBatchErrorDTO }) {
    super(`${p.input}: [${p.id}], ${p.cause.code} (${p.cause.message ?? ''})`)
    this.cause = p?.cause
  }

  get code() {
    return this.cause?.code
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

    throw new RemoDemoFetchBatchError({ id, cause: error, input: this.input })
  }
}
