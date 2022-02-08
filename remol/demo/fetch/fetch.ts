import { action, remolSync } from '@remol/core'

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
}
