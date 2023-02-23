import { RemolDemoFetch } from './fetch.js'

export class RemolDemoFetchMock extends RemolDemoFetch {
  static timeout() {
    return 700
  }

  static data(pathname: string, method: string, body: any) {
    throw new Error('implement')
  }

  static async fetch(url: string, init: RequestInit = {}) {
    if (url.startsWith('/')) url = window.location.origin + url

    const p = new URL(url)
    const method = init.method ?? 'GET'
    const body = init.body ? JSON.parse(init.body.toString()) : { id: p.searchParams.get('id')?.split(',') } ?? []
    const obj = this.data(p.pathname, method, body)

    if (obj === undefined) return super.fetch(url, init)
    const json = JSON.parse(JSON.stringify(obj))

    const res = new Response()
    res.json = () => {
      const pr = Promise.resolve(json)
      pr.then(() => {
        console.log('<-', method, p.pathname, json)
      })
      return pr
    }

    console.log('->', method, p.pathname, init.body)
    const res2 = await new Promise<typeof res>(resolve => setTimeout(() => resolve(res), this.timeout()))

    return res2
  }
}
