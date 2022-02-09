import { action, mem, RemolContext, remolFail } from '@remol/core'

import { RemolDemoFetch } from '../fetch/fetch'
import { RemolModel } from './model'

export class RemolModelStore<Model extends RemolModel> {
  constructor(protected $ = RemolContext.instance) {}

  get fetcher() {
    return this.$.get(RemolDemoFetch)
  }

  api() {
    return '/todos'
  }

  @mem(0) reset(next = null) {
    return Math.random() + new Date().getTime()
  }

  @mem(0) ids() {
    this.reset()
    return this.fetcher.response(this.api()).json() as readonly string[]
  }

  @mem(0) items() {
    return this.ids().map(id => this.item(id))
  }

  model(): Model {
    throw new Error('implement')
  }

  @mem(1) item(id: string) {
    const item = this.model()
    item.reset = this.reset.bind(this)
    item.id = () => id

    return item
  }

  @mem(0) patching(next?: null | Promise<unknown> | Error) {
    return next ?? null
  }

  @mem(0) patches(next?: Record<string, null | Partial<ReturnType<Model['dto']>>>) {
    return next ?? {}
  }

  @action
  patch(id: string, patch: null | Partial<ReturnType<Model['dto']>>) {
    const patches = this.patches()
    patches[id] = patch ? { ...patches[id], ...patch } : null
    // wait
    try {
      const res = this.fetcher.response(this.api(), { method: 'PATCH', body: JSON.stringify(patches) }).json() as {
        ids_processed: string[]
        error?: string
      }
      for (const id of res.ids_processed) {
        delete patches[id]
      }
      this.patching(null)
      this.reset()
    } catch (error) {
      this.patching(error as Promise<unknown> | Error)
      remolFail(error)
    }
  }
}
