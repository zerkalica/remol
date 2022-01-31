export class RemolError extends Error {
  cause?: unknown

  static normalize(error: unknown) {
    return error instanceof Error ? error : new RemolError(String(error))
  }

  constructor(message: string, props?: { cause?: unknown }) {
    super(message)
    this.cause = props?.cause
  }
}
