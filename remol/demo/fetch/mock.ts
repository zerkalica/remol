import { RemolDemoFetch } from './fetch'

export class RemolDemoFetchMock extends RemolDemoFetch {
  static timeout() {
    return 1700
  }

  static data(pathname: string, method: string, body: any) {
    throw new Error('implement')
  }

  static async fetch(url: string, init: RequestInit = {}) {
    if (url.startsWith('/')) url = window.location.origin + url

    const p = new URL(url)
    const method = init.method ?? 'GET'
    const body = init.body ? JSON.parse(init.body.toString()) : { id: p.searchParams.get('id')?.split(',') } ?? []
    const json = this.data(p.pathname, method, body)

    if (json === undefined) return super.fetch(url, init)

    const res = new Response()
    res.json = () => Promise.resolve(json)

    console.log('->', method, p.pathname, init.body)
    const res2 = await new Promise<typeof res>(resolve => setTimeout(() => resolve(res), this.timeout()))
    console.log('<-', method, p.pathname, json)

    return res2
  }
}
