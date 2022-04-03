import { $mol_fail_hidden, $mol_wire_auto, $mol_wire_mem, $mol_wire_task } from 'mol_wire_lib'

import { RemolContextObject } from '../context/object'
import { RemolError } from '../error/error'

export class RemolActionQueue extends RemolContextObject {
  protected tasks = [] as (() => unknown)[]

  run(calculate: () => void) {
    const current = $mol_wire_auto()

    if (!calculate.name && current) {
      Object.defineProperty(calculate, 'name', {
        value: (current as unknown as { [Symbol.toStringTag]: string })[Symbol.toStringTag] + '#task',
      })
    }

    this.tasks.push(calculate)
    this.continue()
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

  protected task: $mol_wire_task<any, unknown[], unknown> | undefined = undefined

  async continue() {
    if (this.tasks.length === 0) return
    if (this.task) return
    this.task = new $mol_wire_task(this[Symbol.toStringTag] + '.up()', this.up, this)

    await Promise.resolve()

    try {
      await this.task.async()
    } catch (error) {
      console.error(error)
    }
  }

  protected up() {
    if (this.tasks.length === 0) return
    const task = this.tasks[0]

    try {
      task()
      this.tasks = this.tasks.slice(1)
      if (this.tasks.length === 0) this.status(false)

      this.task = undefined
      this.continue()
    } catch (err) {
      const error = RemolError.normalize(err)

      if (error instanceof Promise) {
        this.status(true)
      } else {
        this.task = undefined
        this.status([error])
      }

      $mol_fail_hidden(error)
    }
  }

  destructor() {
    this.task?.destructor()
    this.task = undefined
    this.tasks = []
  }
}
