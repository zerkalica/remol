import { mem, RemolContext } from '@remol/core'

import { RemolDemoFetch } from '../fetch/fetch'

export abstract class RemolModelStore<Model extends { id: () => string; dto: (patch?: {} | null) => {} }> extends Object {
  constructor(protected $ = RemolContext.instance) {
    console.log('init store')
    super()
  }

  get fetcher() {
    return this.$.get(RemolDemoFetch)
  }

  abstract api(): string
  abstract apiSelect(): string
  abstract model(): Model

  @mem(0) reset(next?: null) {
    return Math.random() + new Date().getTime()
  }

  @mem(0) selectedIds() {
    this.reset()
    return this.fetcher.response(this.apiSelect()).json() as readonly string[]
  }

  @mem(0) items() {
    return this.selectedIds().map(id => this.item(id))
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

  @mem(0) patching(next?: unknown) {
    return next ?? null
  }

  @mem(0) batchGet() {
    return this.fetcher.get<ReturnType<Model['dto']>>(this.api())
  }

  @mem(0) batchPatch() {
    const batch = this.fetcher.patch<Partial<ReturnType<Model['dto']>>>(this.api())
    batch.reset = this.reset.bind(this)
    return batch
  }

  @mem(1) dto(id: string, patch?: null | Partial<ReturnType<Model['dto']>>) {
    if (patch === undefined) return this.batchGet().request(id)
    return this.batchPatch().request(id, patch)
  }
}
