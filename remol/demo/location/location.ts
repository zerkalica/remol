import { plex } from '@remol/core'
import { RemolViewObject } from '@remol/react'

export class RemolDemoLocation extends RemolViewObject {
  protected get history() {
    return this.ctx(globalThis.history)
  }

  protected get location() {
    return this.ctx(globalThis.location)
  }

  ns() {
    return 'app'
  }

  protected params() {
    return new URLSearchParams(this.location.search)
  }

  protected paramsToString(params: URLSearchParams) {
    const result = params.toString()

    return result ? `?${result}` : ''
  }

  url(next: Record<string, string> = {}, hash?: string) {
    const params = this.params()
    const keys = Object.keys(next)

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const val = next[key]
      if (val === null || val === undefined) {
        params.delete(key)
      } else {
        params.set(key, val)
      }
    }
    const q = this.paramsToString(params)

    return `${this.location.origin}${q}${hash ? `#${hash}` : ''}`
  }

  protected pushState(params: URLSearchParams) {
    this.history.pushState(null, this.ns(), this.paramsToString(params))
  }

  @plex value<V extends string>(key: string, next?: V | null): V | null {
    const params = this.params()
    if (next === undefined) return params.get(key) as V | null

    next === null ? params.delete(key) : params.set(key, String(next))

    this.pushState(params)

    return next
  }
}
