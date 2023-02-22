import { $mol_fail_hidden, $mol_wire_atom, $mol_wire_auto } from 'mol_wire_lib'

import type { RemolContext, RemolContextValue } from '../context/context'

const remolContextInheritedRef = Symbol('remolContextInheritedRef')
const remolContextExplicitRef = Symbol('remolContextExplicitRef')
const cursorMap = new WeakMap<{}, [number]>()

export class RemolObject {
  constructor() {
    const atom = $mol_wire_auto() as undefined | $mol_wire_atom<RemolObject, unknown[], unknown>
    let id = this.constructor.name
    if (atom) {
      let ref = cursorMap.get(atom)

      if (ref === undefined) cursorMap.set(atom, (ref = [0]))
      id = `${atom.toString()}#${ref[0]++}`
    }
    this[Symbol.toStringTag] = id
    this[remolContextInheritedRef] = atom?.host?.$ ?? RemolObject.$
  }

  static $: RemolContext;
  [Symbol.toStringTag]!: string
  private [remolContextInheritedRef]!: RemolContext
  private [remolContextExplicitRef]: RemolContext | undefined = undefined

  get $changed() {
    const ctx = this[remolContextExplicitRef] ?? this[remolContextInheritedRef]
    return ctx !== this.$
  }

  get $() {
    return this[remolContextExplicitRef] ?? this[remolContextInheritedRef]
  }

  set $(next: RemolContext) {
    if (this[remolContextExplicitRef]) $mol_fail_hidden(new Error('Context already defined'))
    this[remolContextExplicitRef] = next
  }

  protected ctx<V extends RemolContextValue>(src: V) {
    return this.$.get(src)
  }

  static make<Instance>(
    this: { new (): Instance },
    config: Partial<Instance> & {
      id?: string | (() => string)
    }
  ): Instance {
    const obj = new this()

    for (let key in config) (obj as any)[key] = config[key as keyof typeof config]!
    ;(obj as any)[Symbol.toStringTag] = typeof config.id === 'function' ? config.id() : config.id

    return obj
  }

  static [Symbol.toPrimitive]() {
    return this.toString()
  }

  static toString() {
    if (Symbol.toStringTag in this) return this[Symbol.toStringTag] as string
    return this.name
  }

  destructor() {}

  toString(): string {
    return this[Symbol.toStringTag] || this.constructor.name + '()'
  }

  toJSON(): any {
    return this.toString()
  }

  private static _instance: Object | undefined = undefined

  static single<Instance>(this: { new (): Instance }): Instance {
    type t = {
      _instance?: Instance
    }

    if (!(this as t)._instance) {
      ;(this as t)._instance = new this()
    }

    return (this as t)._instance!
  }
}
