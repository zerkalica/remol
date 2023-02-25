import { $mol_fail_hidden } from '../stub.js'

export class RemolError {
  static errorMap = new WeakMap<Error, () => void>()
  static get(e: Error) {
    return this.errorMap.get(e)
  }
  static retry<V>(fetch: () => V, retry: () => void) {
    try {
      return fetch()
    } catch (e) {
      if (e instanceof Promise) return $mol_fail_hidden(e)

      const error = e instanceof Error ? e : new Error(String(e), { cause: e })

      this.errorMap.set(error, retry)

      return $mol_fail_hidden(error)
    }
  }
}
