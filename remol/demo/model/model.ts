import { action, mem, RemolContext } from '@remol/core'

import { RemolDemoFetch } from '../fetch/fetch'

export class RemolModel<DTO = unknown> extends Object {
  constructor(protected $ = RemolContext.instance) {
    super()
  }

  get fetcher() {
    return this.$.get(RemolDemoFetch)
  }

  reset() {}

  @mem(0) id(next?: string) {
    return next ?? ''
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

  patch(id: string, patch?: null | Partial<DTO>) {}

  @mem(0) dto(next?: Partial<DTO>) {
    const id = this.id()
    if (next) this.updating(true)
    const res = this.fetcher.response(`${this.api()}/${id}`, {
      method: next === undefined ? 'GET' : 'PUT',
      body: next ? JSON.stringify({ id, ...next }) : undefined,
    })
    this.updating(false)

    const dto = res.json() as DTO

    if (next) this.reset()

    return dto
  }

  @mem(0) removing(next?: boolean) {
    return next ?? false
  }

  @action remove() {
    this.removing(true)
    this.patch(this.id(), null)
    this.removing(false)
    this.reset()
  }
}
