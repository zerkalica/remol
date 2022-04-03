import { action, auto, mem, RemolActionQueue, remolFail } from '@remol/core'

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

  @mem(0) pipe() {
    return new RemolActionQueue()
  }

  @action toggle() {
    const next = !this.checked()
    setTimeout(() => this.checked(next), 0)
  }

  checked(next?: RemolDemoTodoDTO['checked']) {
    return this.dto_pick('checked', next) ?? false
  }

  [Symbol.toStringTag]: string

  @mem(0) id(next?: string) {
    return this.dto_pick('id', next)
  }

  @mem(1) dto_pick<Field extends keyof RemolDemoTodoDTO>(field: Field, value?: RemolDemoTodoDTO[Field]) {
    const prev = this.dto_safe()
    if (value === undefined) return prev[field]

    const next = this.dto_safe({ ...prev, [field]: value })

    return next[field]
  }

  @mem(0) dto(next?: Partial<RemolDemoTodoDTO> | null) {
    return next ?? {}
  }

  get pending() {
    const result = this.status() === true
    // console.log('pending', auto())
    console.log('pending', result)
    return result
  }

  get error() {
    const v = this.status()

    return v instanceof Error ? v : undefined
  }

  @mem(0) status(next?: boolean | Error) {
    console.log('status', auto()?.sub_list)
    if (next !== undefined) console.log('set status', next)
    return next ?? false
  }

  remove() {
    this.dto_safe(null)
  }

  @mem(0) dto_safe(next?: Partial<RemolDemoTodoDTO> | null) {
    try {
      const dto = this.dto(next)
      this.status(false)
      return dto
    } catch (error) {
      this.status(error instanceof Promise ? true : (error as Error))
      remolFail(error)
    }
  }
}
