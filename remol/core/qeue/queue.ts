import { remolFuncName } from '../func/name.js'
import { RemolObject } from '../object/object.js'
import { $, $mol_fail_hidden, $mol_wire_auto, $mol_wire_solo, $mol_wire_task } from '../stub.js'

export class RemolQueue extends RemolObject {
  protected tasks = [] as (() => unknown)[]

  run(calculate: () => void) {
    const current = $mol_wire_auto()

    this.tasks.push(
      remolFuncName(
        calculate,
        (
          current as unknown as {
            [Symbol.toStringTag]: string
          }
        )[Symbol.toStringTag] + '#task'
      )
    )
    this.continue()
  }

  @$mol_wire_solo status(next?: [Error] | boolean) {
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

  protected task: $.$mol_wire_task<any, unknown[], unknown> | undefined = undefined

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
      if (err instanceof Promise) {
        this.status(true)

        return $mol_fail_hidden(err)
      }

      this.task = undefined
      const error = err instanceof Error ? err : new Error(String(err), { cause: err })
      this.status([error])
      $mol_fail_hidden(error)
    }
  }

  destructor() {
    this.task?.destructor()
    this.task = undefined
    this.tasks = []
  }
}
