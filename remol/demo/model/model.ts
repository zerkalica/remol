import { action, mem, RemolContext, remolFail } from '@remol/core'

import { RemolDemoFetch } from '../fetch/fetch'

declare var crypto: {
  randomUUID(): string
}

export class RemolModel<DTO = unknown> extends Object {
  constructor(protected $ = RemolContext.instance) {
    super()
  }

  get fetcher() {
    return this.$.get(RemolDemoFetch)
  }

  @mem(0) id(next?: string) {
    return next ?? (crypto.randomUUID() || remolFail(new Error('Crypto.randomUUID() not supported')))
  }

  @mem(1) dto_pick<Field extends keyof DTO>(field: Field, next?: DTO[Field]) {
    return this.dto(next === undefined ? undefined : { ...this.dto(), [field]: next })[field]
  }

  api(): string {
    throw new Error('implement')
  }

  @mem(0) updating(next?: boolean) {
    return next ?? false
  }

  @mem(0) dto(next?: Partial<DTO> | null): DTO {
    throw new Error('implement')
  }

  @mem(0) removing(next?: boolean) {
    return next ?? false
  }

  @action remove() {
    this.dto(null)
  }
}
