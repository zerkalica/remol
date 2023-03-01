import { action, sync } from '@remol/core'

import { RemoDemoFetchBatch } from './batch.js'

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
    const response = sync(this).request(input, init)

    if (Math.floor(response.status / 100) === 2) return sync(response)

    throw new Error(response.statusText || `HTTP Error ${response.status}`)
  }

  @action static batch<V>(input: RequestInfo, init?: RequestInit) {
    return RemoDemoFetchBatch.response(input, this.response(input, init).json()) as Record<string, V>
  }
}
