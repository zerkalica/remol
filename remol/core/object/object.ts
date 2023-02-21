import { $mol_object } from 'mol_wire_lib'

import { RemolContext, RemolContextValue } from '../context/context'

export class RemolObject extends $mol_object {
  constructor() {
    super()
    this[Symbol.toStringTag] = RemolContext.id ?? this.constructor.name
  }

  [Symbol.toStringTag]!: string

  protected __ = RemolContext.instance

  get _() {
    return this.__
  }

  set _(next: RemolContext) {
    this.__ = next
  }

  protected ctx<V extends RemolContextValue>(src: V) {
    return this._.get(src)
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
