import { $mol_fail_hidden, $mol_object2, $mol_wire_fiber, $mol_wire_mem } from 'mol_wire_lib'

export class RemolActionQueue extends $mol_object2 {
  constructor(id?: string) {
    super()
    this[Symbol.toStringTag] = id ?? this.constructor.name
  }

  [Symbol.toStringTag]: string

  protected tasks: $mol_wire_fiber<any, unknown[], unknown>[] = []

  run(calculate: () => void) {
    try {
      calculate()
      this.status(false)
    } catch (error: unknown) {
      this.status(error instanceof Promise ? true : [error as Error])
      $mol_fail_hidden(error)
    }

    // const current = $mol_wire_auto()

    // if (!calculate.name && current) {
    //   Object.defineProperty(calculate, 'name', {
    //     value: (current as unknown as { [Symbol.toStringTag]: string })[Symbol.toStringTag] + '#task',
    //   })
    // }

    // this.tasks.push(this.createFiber(calculate))
    // this.refresh()
  }

  createFiber(calculate: () => void) {
    const fiber = new $mol_wire_fiber(this, calculate, this[Symbol.toStringTag] + '.fiber')
    return fiber
  }

  @$mol_wire_mem(0) status(next?: [Error] | boolean) {
    return next ?? false
  }

  get pending() {
    return this.status() === true
  }

  get error() {
    const status = this.status()
    return status instanceof Array ? status[0] : undefined
  }

  get complete() {
    return this.status() === false
  }

  protected scheduled = false

  refresh() {
    if (this.tasks.length === 0) return
    if (this.scheduled) return
    this.scheduled = true

    // Recreate completed fiber if refresh called from error
    // this.tasks[0] = $mol_wire_fiber.temp(null, this.tasks[0].task)
    Promise.resolve().then(this.up.bind(this))
  }

  async up() {
    if (this.tasks.length === 0) return
    const task = this.tasks[0]

    try {
      this.status(true)
      await task.async()
      this.tasks = this.tasks.slice(1)

      if (this.tasks.length === 0) this.status(false)

      this.scheduled = false
      this.refresh()
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.scheduled = false
      }

      this.status(error instanceof Promise ? true : [error as Error])
      if (error instanceof Promise) return error
      console.error(error)
    }
  }

  destructor() {
    for (let task of this.tasks) task.destructor()
    this.tasks = []
    this.scheduled = false
  }
}
