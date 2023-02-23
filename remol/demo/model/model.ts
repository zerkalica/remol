import { action, failHidden, plex, RemolObject, solo } from '@remol/core'

import { RemolDemoFetch } from '../fetch/fetch.js'

declare var crypto: {
  randomUUID(): string
}

export abstract class RemolModel<DTO extends Object = Object> extends RemolObject {
  @action static createId() {
    return crypto.randomUUID() || failHidden(new Error('Crypto.randomUUID() not supported, update your browser'))
  }

  get fetcher() {
    return this.ctx(RemolDemoFetch)
  }

  @solo id(next?: string) {
    return next ?? RemolModel.createId()
  }

  @plex dto_pick<Field extends keyof DTO>(field: Field, next?: DTO[Field]) {
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

  @solo patching(next?: unknown) {
    return next ?? null
  }

  @action remove() {
    try {
      this.dto(null)
      this.patching(null)
    } catch (error) {
      this.patching(error)
      failHidden(error)
    }
  }
}
