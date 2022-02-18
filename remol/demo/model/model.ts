import { action, mem, RemolContext, remolFail } from '@remol/core'

import { RemolDemoFetch } from '../fetch/fetch'

declare var crypto: {
  randomUUID(): string
}

export abstract class RemolModel<DTO extends Object = Object> extends Object {
  constructor(protected $ = RemolContext.instance) {
    super()
  }

  @action static createId() {
    return crypto.randomUUID() || remolFail(new Error('Crypto.randomUUID() not supported, update your browser'))
  }

  get fetcher() {
    return this.$.get(RemolDemoFetch)
  }

  @mem(0) id(next?: string) {
    return next ?? RemolModel.createId()
  }

  @mem(1) dto_pick<Field extends keyof DTO>(field: Field, next?: DTO[Field]) {
    return this.dto(next === undefined ? undefined : { ...this.dto(), [field]: next })[field]
  }

  dto(next?: Partial<DTO> | null): DTO {
    throw new Error('implement')
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

  @action remove() {
    try {
      this.dto(null)
      this.patching(null)
    } catch (error) {
      this.patching(error)
      remolFail(error)
    }
  }
}
