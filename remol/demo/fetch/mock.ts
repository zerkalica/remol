import { RemolDemoFetch } from './fetch'

export class RemolDemoFetchMock extends RemolDemoFetch {
  static timeout() {
    return 300
  }

  static data(pathname: string, method: string, body: any) {
    throw new Error('implement')
  }

  static override fetch(url: string, init: RequestInit = {}) {
    if (url.startsWith('/')) url = window.location.origin + url

    const p = new URL(url)
    const body = init.body ? JSON.parse(init.body.toString()) : { id: p.searchParams.get('id')?.split(',') } ?? []
    const json = this.data(p.pathname, init.method ?? 'GET', body)

    if (json === undefined) return super.fetch(url, init)

    console.log({ url })

    const res = new Response()
    res.json = () => Promise.resolve(json)

    return new Promise<typeof res>(resolve => setTimeout(() => resolve(res), this.timeout()))
  }
}
