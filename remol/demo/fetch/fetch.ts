import { action, remolSync } from '@remol/core'

import { RemoDemoFetchBatch } from './batch'

export class RemolDemoFetch {
  static fetch(input: RequestInfo, init: RequestInit = {}) {
    return window.fetch(input, init)
  }

  static request(input: RequestInfo, init: RequestInit = {}) {
    let ctl: undefined | AbortController = new AbortController()

    const promise = this.fetch(input, {
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

  @action static response(input: RequestInfo, init?: RequestInit) {
    const response = remolSync(this).request(input, init)

    if (Math.floor(response.status / 100) === 2) return remolSync(response)

    throw new Error(response.statusText || `HTTP Error ${response.status}`)
  }

  @action static batch<V>(input: RequestInfo, init?: RequestInit) {
    return RemoDemoFetchBatch.response(input, this.response(input, init).json()) as Record<string, V | undefined>
  }
}
