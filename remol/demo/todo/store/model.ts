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

  @mem(0) id(next?: string) {
    return this.dto_pick('id', next)
  }

  @mem(1) dto_pick<Field extends keyof RemolDemoTodoDTO>(field: Field, value?: RemolDemoTodoDTO[Field]) {
    const prev = this.dto()
    if (value === undefined) return prev[field]

    const next = this.dto({ ...prev, [field]: value })

    return next[field]
  }

  @mem(0) dto(next?: Partial<RemolDemoTodoDTO> | null) {
    return next ?? {}
  }

  get pending() {
    return this.status() === true
  }

  get error() {
    const v = this.status()

    return v instanceof Error ? v : undefined
  }

  @mem(0) status(next?: boolean | Error) {
    return next ?? false
  }

  remove() {
    this.update(null)
  }

  @action update(patch: Partial<RemolDemoTodoDTO> | null) {
    try {
      this.dto(patch)
      this.status(false)
    } catch (error) {
      this.status(error instanceof Promise ? true : (error as Error))
      remolFail(error)
    }
  }
}