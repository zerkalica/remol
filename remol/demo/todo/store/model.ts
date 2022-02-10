import { action, mem, remolFail } from '@remol/core'

export type RemolDemoTodoDTO = {
  id: string
  title: string
  checked: boolean
}

declare var crypto: {
  randomUUID(): string
}

export class RemolDemoTodoModel extends Object {
  static instance = new RemolDemoTodoModel()

  constructor(id = 'RemolDemoTodo') {
    super()
    this[Symbol.toStringTag] = id
  }

  title(next?: RemolDemoTodoDTO['title']) {
    return this.dto_pick('title', next) ?? 'test'
  }

  @action toggle() {
    this.checked(!this.checked())
  }

  checked(next?: RemolDemoTodoDTO['checked']) {
    return this.dto_pick('checked', next) ?? false
  }

  [Symbol.toStringTag]: string

  @mem(0) id() {
    return (
      this.dto_pick('id') ??
      (crypto.randomUUID() || remolFail(new Error('Crypto.randomUUID() not supported, update your browser')))
    )
  }

  @mem(1) dto_pick<Field extends keyof RemolDemoTodoDTO>(field: Field, value?: RemolDemoTodoDTO[Field]) {
    const next = this.dto(value === undefined ? undefined : { ...this.dto(), [field]: value })

    return next[field]
  }

  @mem(1) dto(next?: Partial<RemolDemoTodoDTO> | null) {
    return next ?? {}
  }

  get pending() {
    return this.status() instanceof Promise
  }

  get error() {
    const v = this.status()

    return v instanceof Error ? v : undefined
  }

  @mem(0) status(next?: unknown) {
    return next ?? null
  }

  @action update(patch: Partial<RemolDemoTodoDTO> | null = null) {
    try {
      this.dto(patch)
      this.status(null)
    } catch (error) {
      this.status(error)
      remolFail(error)
    }
  }
}
