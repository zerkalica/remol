import { sync, action } from '@remol/core'

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
    const response = sync(this).request(input, init)
    if (Math.floor(response.status / 100) === 2) return sync(response)

    throw new Error(response.statusText || `HTTP Error ${response.status}`)
  }
}
