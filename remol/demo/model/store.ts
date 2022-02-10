import { action, mem, RemolContext, remolFail, remolWaitTimeout } from '@remol/core'

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
    item.id = () => id
    item.dto = this.dto.bind(this, id)

    return item
  }

  get pending() {
    return this.patching() instanceof Promise
  }

  get error() {
    const v = this.patching()

    return v instanceof Error ? v : undefined
  }

  @mem(0) patching(next?: null | Promise<unknown> | Error) {
    return next ?? null
  }

  @mem(0) queueDto(next?: Record<string, null | undefined | Partial<ReturnType<Model['dto']>>>) {
    return next ?? {}
  }

  @mem(0) queueIds(next?: string[]) {
    return next ?? []
  }

  @action queueGet() {
    const ids = this.queueIds()
    const body = JSON.stringify(ids)
    const res = this.fetcher.response(this.api(), { method: 'GET', body }).json() as Record<string, ReturnType<Model['dto']>>
    this.queueIds(this.queueIds().filter(id => Boolean(res[id])))
    return res
  }

  @action queuePatch() {
    const patches = this.queueDto()
    const body = JSON.stringify(patches)
    const res = this.fetcher.response(this.api(), { method: 'PATCH', body }).json() as Record<string, ReturnType<Model['dto']>>
    for (const id of Object.keys(res)) {
      delete patches[id]
    }

    return res
  }

  @mem(1) dto(id: string, patch?: null | Partial<ReturnType<Model['dto']>>) {
    if (patch === undefined) this.queueIds().push(id)
    else Object.assign(this.queueDto(), { [id]: patch })

    remolWaitTimeout(200)

    if (patch === undefined) return this.queueGet()[id]

    try {
      const res = this.queuePatch()[id]
      this.patching(null)
      this.reset()

      return res
    } catch (error) {
      this.patching(error as Error | Promise<unknown>)

      remolFail(error)
    }
  }
}
