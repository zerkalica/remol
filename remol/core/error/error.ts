export class RemolError extends Error {
  cause?: any

  static errorMap = new WeakMap<Object, Error>()

  static normalize(error: unknown) {
    if (error instanceof Error || error instanceof Promise) return error

    const isObject = error !== null && typeof error === 'object'
    let normalized = isObject ? this.errorMap.get(error) : undefined

    if (!normalized) {
      const code = (isObject ? (error as RemolError).code : undefined) ?? 'unknown'
      const message = (isObject ? (error as RemolError).message : undefined) ?? String(error)
      normalized = new RemolError(code, message, { cause: error })
      if (isObject) this.errorMap.set(error, normalized)
    }

    return normalized
  }

  constructor(readonly code: string, message?: string, props?: { cause?: unknown }) {
    super(message ?? code)
    this.cause = props?.cause
  }
}
