import { action, remolSync } from '@remol/core'

type BatchErrorDTO = {
  code: string
  message?: string
}

export class RemolDemoFetch {
  static request(input: RequestInfo, init: RequestInit = {}) {
    let ctl: undefined | AbortController = new AbortController()
    const promise = fetch(input, {
      ...init,
      signal: ctl.signal,
    }).finally(() => {
      ctl = undefined
    })

    return Object.assign(promise, {
      destructor() {
        ctl?.abort()
      },
    })
  }

  @action
  static response(input: RequestInfo, init?: RequestInit) {
    const response = remolSync(this).request(input, init)
    if (Math.floor(response.status / 100) === 2) return remolSync(response)

    throw new Error(response.statusText || `HTTP Error ${response.status}`)
  }

  @action static batch<V extends Object>(input: RequestInfo, init?: RequestInit): Record<string, V> {
    const res = this.response(input, init).json() as {
      data: Record<string, V>
      errors?: Record<string, BatchErrorDTO>
    }
    for (const id of Object.keys(res.errors ?? {})) {
      res.data[id] = new Proxy(res.errors![id] as unknown as V, {
        get(t: V, k) {
          throw new Error(`${(t as unknown as BatchErrorDTO).message ?? (t as unknown as BatchErrorDTO).code ?? 'unknown'}`)
        },
      })
    }

    return res.data
  }
}
